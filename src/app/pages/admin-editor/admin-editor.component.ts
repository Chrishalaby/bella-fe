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
import { EditorModule } from 'primeng/editor';
import { FileUpload } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { concatMap, finalize, from, switchMap, tap } from 'rxjs';
import { Section } from '../../models/section.model';
import { SectionService } from '../../services/section.service';
import {
  DeleteContent,
  SaveContent,
  UpdateContent,
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
    EditorModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="card">
      <p-tabs>
        <p-tablist>
          <p-tab value="0">About Section</p-tab>
          <p-tab value="1">Team Members</p-tab>
          <p-tab value="2">Blog Posts</p-tab>
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
                <p>Current Content:</p>
                <p [innerHTML]="aboutContent()?.text"></p>

                <label for="aboutText">New Content</label>
                <p-editor
                  formControlName="text"
                  [style]="{ height: '320px' }"
                ></p-editor>
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
                />
                }
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
            <div class="flex justify-content-between mb-3">
              <button
                pButton
                label="Add Team Member"
                (click)="addTeamMember()"
                class="p-button-success"
              ></button>
              <button
                pButton
                label="Save All Members"
                (click)="saveTeamMembers()"
                class="p-button-primary"
              ></button>
            </div>
            <form [formGroup]="teamForm">
              <p-table [value]="teamMemberControls" [responsive]="true">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-member let-i="index">
                  <tr>
                    <td>
                      <input pInputText [formControl]="member.get('title')" />
                    </td>
                    <td>
                      <input pInputText [formControl]="member.get('text')" />
                    </td>
                    <td>
                      @if (member.get('imageUrl').value) {
                      <img
                        [src]="member.get('imageUrl').value"
                        style="max-width: 100px"
                      />
                      }
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
                        (click)="saveSection(member, 'team')"
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

          <p-tabpanel value="2">
            <div class="flex justify-content-between mb-3">
              <button
                pButton
                label="New Blog Post"
                (click)="addBlogPost()"
                class="p-button-success"
              ></button>
            </div>
            <form [formGroup]="blogForm">
              <p-table [value]="blogPosts()" [responsive]="true">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Title</th>
                    <th>Content Preview</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-post>
                  <tr>
                    <td>
                      <input
                        pInputText
                        [(ngModel)]="post.title"
                        [ngModelOptions]="{ standalone: true }"
                      />
                    </td>
                    <td>
                      <p-editor
                        [(ngModel)]="post.text"
                        [ngModelOptions]="{ standalone: true }"
                        [style]="{ height: '220px' }"
                      >
                      </p-editor>
                    </td>
                    <td>
                      @if (post.imageUrl) {
                      <img [src]="post.imageUrl" style="max-width: 100px" />
                      }
                      <p-fileUpload
                        mode="basic"
                        [auto]="true"
                        chooseLabel="Change"
                        accept="image/*"
                        [maxFileSize]="1000000"
                        (uploadHandler)="onUpload($event, 'blog', post)"
                        [customUpload]="true"
                      >
                      </p-fileUpload>
                    </td>
                    <td>
                      <button
                        pButton
                        icon="pi pi-save"
                        (click)="saveBlogPost(post)"
                        class="p-button-success mr-2"
                      ></button>
                      <button
                        pButton
                        icon="pi pi-trash"
                        (click)="deleteBlogPost(post)"
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
  readonly #sectionService = inject(SectionService);
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

  blogForm = this.fb.group({});

  aboutContent = this.store.selectSignal(
    (state) => state.content.sections['about']?.[0]
  );

  teamMembers = this.store.selectSignal(
    (state) => state.content.sections['team']
  );

  blogPosts = this.store.selectSignal(
    (state) => state.content.sections['blog']
  );

  get teamMemberControls() {
    return (this.teamForm.get('members') as FormArray).controls as FormGroup[];
  }

  constructor() {
    effect(() => {
      const about = this.aboutContent();
      if (about) {
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
  onUpload(event: any, section: string, content?: any) {
    const file = event.files[0];

    this.#sectionService
      .uploadImage(file)
      .pipe(
        switchMap((response: { url: string }) => {
          let updatedContent;

          switch (section) {
            case 'about':
              updatedContent = {
                ...this.aboutContent(),
                imageUrl: response.url,
                section: 'about',
              };
              break;
            case 'blog':
              updatedContent = {
                ...content,
                imageUrl: response.url,
                section: 'blog',
              };
              break;
            case 'team':
              updatedContent = {
                ...content,
                imageUrl: response.url,
                section: 'team',
              };
              break;
          }

          console.log('Response:', response);
          console.log('Updated content:', updatedContent);
          return this.store.dispatch(new UpdateContent(updatedContent));
        })
      )
      .subscribe(() => {
        this.showSuccess('Image uploaded successfully');
      });
  }
  saveSection(form: FormGroup, sectionType?: string) {
    const section = { ...form.value, section: sectionType };
    this.store
      .dispatch(new UpdateContent(section))
      .pipe(tap(() => this.showSuccess('Content saved successfully')))
      .subscribe();
  }
  addTeamMember() {
    const membersArray = this.teamForm.get('members') as FormArray;
    const newMember = this.fb.group({
      title: ['New Team Member'],
      text: ['Position'],
      section: ['team'],
      imageUrl: [''],
    });
    membersArray.push(newMember);
  }

  saveTeamMembers() {
    const members = this.teamMemberControls.map((control) => ({
      ...control.value,
      section: 'team',
    }));

    from(members)
      .pipe(
        concatMap((member) => this.store.dispatch(new UpdateContent(member))),
        finalize(() => this.showSuccess('Team members saved successfully'))
      )
      .subscribe();
  }

  addBlogPost() {
    const newPost = {
      title: 'New Blog Post',
      text: '',
      section: 'blog',
      imageUrl: '',
    };
    this.store.dispatch(new SaveContent(newPost));
  }

  saveBlogPost(post: any) {
    const updatedPost = { ...post, section: 'blog' };
    this.store
      .dispatch(new UpdateContent(updatedPost))
      .pipe(tap(() => this.showSuccess('Blog post saved')))
      .subscribe();
  }

  deleteBlogPost(post: any) {
    this.store
      .dispatch(new DeleteContent(post.id))
      .pipe(tap(() => this.showSuccess('Blog post deleted')))
      .subscribe();
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
