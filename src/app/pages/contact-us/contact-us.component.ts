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
@Component({
  selector: 'app-contact-us',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactUsComponent {
  readonly #fb = inject(FormBuilder);
  readonly #http = inject(HttpClient);

  contactForm: FormGroup = this.#fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });
  content: any[] = [
    {
      icon: 'pi pi-fw pi-phone',
      title: 'Phone',
      info: '(961) 71 067 260',
      contact: '96171067260',
    },
    {
      icon: 'pi pi-fw pi-map-marker',
      title: 'Our Head Office',
      info: 'Master Mall, Burj Hammoud, Lebanon',
      contact: 'Master Mall, Burj Hammoud, Lebanon',
    },
    {
      icon: 'pi pi-fw pi-envelope',
      title: 'Email',
      info: 'elhalabichristian@gmail.com',
      contact: 'elhalabichristian@gmail.com',
    },
  ];

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.#http
        .post('https://formspree.io/f/xvgooygl', formData)
        .subscribe(() => {
          // this.notificationService.showSuccess(
          //   'Your message has been sent successfully'
          // );
          this.contactForm.reset();
        });
    }
  }
}
