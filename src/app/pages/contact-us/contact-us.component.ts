import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'app-contact-us',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
  providers: [MessageService],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactUsComponent {
  readonly #fb = inject(FormBuilder);
  readonly #http = inject(HttpClient);
  readonly #messageService = inject(MessageService);

  contactForm: FormGroup = this.#fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });
  content: any[] = [
    {
      icon: 'pi pi-fw pi-phone',
      title: 'Phone',
      info: '+32 471 12 72 51',
      contact: '32471127251',
    },
    {
      icon: 'pi pi-fw pi-map-marker',
      title: 'Our Head Office',
      info: 'KU Leuven, Leuven, Belgium',
      contact: 'KU Leuven, Leuven, Belgium',
    },
    {
      icon: 'pi pi-fw pi-envelope',
      title: 'Email',
      info: 'bella.manshian@kuleuven.be',
      contact: 'bella.manshian@kuleuven.be',
    },
  ];

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.#http
        .post('https://formspree.io/f/xgvvpoql', formData)
        .subscribe(() => {
          this.#messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Message sent successfully',
          });
          this.contactForm.reset();
        });
    }
  }
}
