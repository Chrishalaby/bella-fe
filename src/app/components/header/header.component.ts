import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../layout/service/app.layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    BadgeModule,
    RippleModule,
    StyleClassModule,
  ],
})
export class HeaderComponent {
  readonly #router = inject(Router);
  readonly #layoutService = inject(LayoutService);
  // readonly #store = inject(Store);

  //   constructor() {}

  //   onProfileButtonClick() {
  //     this.#layoutService.showProfileSidebar();
  //   }

  onCartButtonClick() {
    this.#router.navigate(['/ecommerce/shopping-cart']);
  }
}
