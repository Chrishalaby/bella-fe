import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SidebarModule } from 'primeng/sidebar';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-profilemenu',
  templateUrl: './app.profilesidebar.component.html',
  imports: [CommonModule, SidebarModule],
})
export class AppProfileSidebarComponent {
  readonly #store = inject(Store);
  readonly #router = inject(Router);
  readonly #layoutService = inject(LayoutService);

  // protected readonly isAuthenticated = this.#store.selectSignal(
  //     UserState.isAuthenticated
  // );
  // protected readonly currentUser = this.#store.selectSignal(
  //     UserState.currentUser
  // );

  get visible(): boolean {
    return this.#layoutService.state.profileSidebarVisible;
  }

  set visible(_val: boolean) {
    this.#layoutService.state.profileSidebarVisible = _val;
  }

  // protected logAction() {
  //     if (this.isAuthenticated()) {
  //         this.#store.dispatch(new Logout());
  //     } else {
  //         this.#router.navigate(['auth/login']);
  //     }
  // }
}
