import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { ToastModule } from 'primeng/toast';
import { InitializeApp } from './store/actions/section.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  template: `
    <!-- <p-toast></p-toast> -->
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  readonly #store = inject(Store);

  constructor() {
    this.#store.dispatch(new InitializeApp());
  }
}
