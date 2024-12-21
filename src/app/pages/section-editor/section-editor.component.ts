import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SectionService } from '../../services/section.service';

@Component({
  selector: 'app-section-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: ` <form [formGroup]="sectionForm" (ngSubmit)="onSubmit()">
    <input formControlName="title" placeholder="Title" />
    <textarea formControlName="text" placeholder="Content"></textarea>

    @if (currentImageUrl){
    <div class="preview">
      <img [src]="currentImageUrl" />
    </div>
    }

    <input type="file" (change)="onFileSelected($event)" accept="image/*" />

    <button type="submit">Save Changes</button>
  </form>`,
  styleUrl: './section-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionEditorComponent implements OnInit {
  readonly #formBuilder = inject(FormBuilder);
  readonly #sectionService = inject(SectionService);
  readonly #route = inject(ActivatedRoute);

  sectionForm = this.#formBuilder.group({
    title: [''],
    text: [''],
    section: [''],
  });

  currentImageUrl: string = '';
  sectionId: number = 0;

  ngOnInit() {
    // Load existing section content
    const sectionName = this.#route.snapshot.params['section'];
    this.#sectionService.getSection(sectionName).subscribe((sections) => {
      if (sections.length > 0) {
        const section = sections[0];
        this.sectionId = section.id;
        this.currentImageUrl = section.imageUrl ?? '';
        this.sectionForm.patchValue({
          title: section.title,
          text: section.text,
          section: sectionName,
        });
      }
    });
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.#sectionService.uploadImage(file).subscribe((response) => {
        this.currentImageUrl = response.imageUrl;
      });
    }
  }

  onSubmit() {
    const sectionData = {
      ...this.sectionForm.value,
      imageUrl: this.currentImageUrl,
    };

    this.#sectionService.updateSection(this.sectionId, sectionData).subscribe();
  }
}
