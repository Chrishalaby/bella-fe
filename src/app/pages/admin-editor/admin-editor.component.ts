import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { firstValueFrom, tap } from 'rxjs';
import { Section } from '../../models/section.model';
import {
  DeleteContent,
  SaveContent,
  UpdateContent,
  UploadImage,
} from '../../store/actions/section.actions';
@Component({
  selector: 'app-admin-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TabsModule,
    InputTextModule,
    FileUpload,
    TextareaModule,
    FormsModule,
    TableModule,
    Toast,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="card">
      <p-tabs>
        <p-tablist>
          <p-tab value="0">About Section</p-tab>
          <p-tab value="1">Team Members</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0" [formGroup]="aboutForm">
            <div class="p-fluid">
              <div class="field">
                <label for="aboutTitle">Title</label>
                <input
                  id="aboutTitle"
                  type="text"
                  pInputText
                  formControlName="title"
                />
              </div>
              <div class="field">
                <label for="aboutText">Content</label>
                <textarea
                  id="aboutText"
                  pTextarea
                  formControlName="text"
                  rows="5"
                ></textarea>
              </div>
              <div class="field">
                <label>Image</label>
                <p-fileUpload
                  mode="basic"
                  [auto]="true"
                  chooseLabel="Upload Image"
                  accept="image/*"
                  [maxFileSize]="1000000"
                  (uploadHandler)="onUpload($event, 'about')"
                  [customUpload]="true"
                >
                </p-fileUpload>
                @if (aboutContent()?.imageUrl){
                <img
                  [src]="aboutContent().imageUrl"
                  class="mt-2"
                  style="max-width: 200px"
                />}
              </div>
              <button
                pButton
                label="Save About Section"
                (click)="saveSection(aboutForm, 'about')"
                class="p-button-primary"
              ></button>
            </div>
          </p-tabpanel>

          <p-tabpanel value="1">
            <form [formGroup]="teamForm">
              <p-table [value]="teamMemberControls" [responsive]="true">
                <ng-template pTemplate="body" let-member let-i="index">
                  <tr>
                    <td>
                      <input pInputText [formControl]="member.get('title')" />
                    </td>
                    <td>
                      <input pInputText [formControl]="member.get('text')" />
                    </td>
                    <td>
                      <img
                        [src]="member.get('imageUrl').value"
                        style="max-width: 100px"
                      />
                      <p-fileUpload
                        mode="basic"
                        [auto]="true"
                        chooseLabel="Change"
                        accept="image/*"
                        [maxFileSize]="1000000"
                        (uploadHandler)="onUpload($event, 'team', member.value)"
                        [customUpload]="true"
                      >
                      </p-fileUpload>
                    </td>
                    <td>
                      <button
                        pButton
                        icon="pi pi-save"
                        (click)="saveSection(member.value, 'team')"
                        class="p-button-success mr-2"
                      ></button>
                      <button
                        pButton
                        icon="pi pi-trash"
                        (click)="deleteTeamMember(member.value)"
                        class="p-button-danger"
                      ></button>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </form>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class AdminEditorComponent {
  private store = inject(Store);
  private messageService = inject(MessageService);

  private fb = inject(FormBuilder);

  aboutForm = this.fb.group({
    id: null,
    title: [''],
    text: [''],
    imageUrl: [''],
    section: ['about'],
  });

  teamForm = this.fb.group({
    members: this.fb.array([]),
  });

  aboutContent = this.store.selectSignal(
    (state) => state.content.sections['about']?.[0]
  );

  teamMembers = this.store.selectSignal(
    (state) => state.content.sections['team']
  );

  get teamMemberControls() {
    return (this.teamForm.get('members') as FormArray).controls as FormGroup[];
  }

  constructor() {
    effect(() => {
      const about = this.aboutContent();
      if (about) {
        console.log('About content:', about);
        this.aboutForm.patchValue(about);
      }
    });

    effect(() => {
      const members = this.teamMembers();
      if (members?.length) {
        const formArray = this.fb.array(
          members.map((member: Section) =>
            this.fb.group({
              id: member.id,
              title: member.title,
              text: member.text,
              imageUrl: member.imageUrl,
              section: ['team'],
            })
          )
        );
        this.teamForm.setControl('members', formArray);
      }
    });
  }

  onUpload(event: any, section: string, member?: Section) {
    const file = event.files[0];

    firstValueFrom(this.store.dispatch(new UploadImage(file))).then(
      (response: any) => {
        if (section === 'about') {
          const updatedContent = {
            ...this.aboutContent(),
            imageUrl: response[0].imageUrl,
            section: 'about',
          };
          this.store.dispatch(new UpdateContent(updatedContent));
        } else if (member) {
          const updatedMember = {
            ...member,
            imageUrl: response[0].imageUrl,
            section: 'team',
          };
          this.store.dispatch(new UpdateContent(updatedMember));
        }
        this.showSuccess('Image uploaded successfully');
      }
    );
  }

  saveSection(form: FormGroup, sectionType?: string) {
    const section = { ...form.value, section: sectionType };
    this.store
      .dispatch(new UpdateContent(section))
      .pipe(tap(() => this.showSuccess('Content saved successfully')))
      .subscribe();
  }
  addTeamMember() {
    const newMember: Section = {
      title: 'New Team Member',
      text: 'Position',
      section: 'team',
      imageUrl: '',
    } as Section;
    this.store.dispatch(new SaveContent(newMember));
  }

  deleteTeamMember(member: Section) {
    this.store
      .dispatch(new DeleteContent(member.id))
      .pipe(tap(() => this.showSuccess('Team member removed')))
      .subscribe();
  }

  private showSuccess(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail,
    });
  }
}
