import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <header class="relative bg-primary py-8 md:py-6">
        <div class="mx-auto px-4">
          <h1 class="text-6xl font-bold mb-4 text-white">
            Welcome to Our Platform
          </h1>
          <p class="text-2xl mb-4 text-white">
            Discover amazing content and connect with our team
          </p>
          <a
            routerLink="/about"
            class="bg-white text-primary px-5 py-3 border-round-lg font-medium
            hover:bg-primary-50 transition-all transition-duration-200"
          >
            Learn More
          </a>
        </div>
      </header>

      <!-- Team Section -->
      <section class="py-8 surface-ground">
        <div class="mx-auto px-4">
          <h2 class="text-4xl font-bold text-center mb-6">Meet Our Team</h2>
          <div class="grid">
            <div
              class="col-12 md:col-6 lg:col-4"
              *ngFor="let member of teamMembers()"
            >
              <div class="surface-card border-round-xl p-4 m-2 shadow-2">
                @if (member.imageUrl) {
                <img
                  [src]="member.imageUrl"
                  [alt]="member.title"
                  class="w-8rem h-8rem border-circle mx-auto mb-3"
                />
                } @else {
                <div
                  class="w-8rem h-8rem border-circle bg-primary-100 mx-auto mb-3 flex
                    align-items-center justify-content-center"
                >
                  <span class="text-4xl text-primary">{{
                    member.title[0]
                  }}</span>
                </div>
                }
                <h3 class="text-2xl font-medium text-center mb-2">
                  {{ member.title }}
                </h3>
                <p class="text-600 text-center">{{ member.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-8 bg-primary text-white">
        <div class="mx-auto px-4 text-center">
          <h2 class="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p class="text-2xl mb-4">Join us today and explore our services</p>
          <div class="flex justify-content-center gap-3">
            <a
              routerLink="/contact"
              class="bg-white text-primary px-5 py-3 border-round-lg font-medium
              hover:bg-primary-50 transition-all transition-duration-200"
            >
              Contact Us
            </a>
            <a
              routerLink="/blog"
              class="border-2 border-white text-white px-5 py-3 border-round-lg
              font-medium hover:bg-primary-700 transition-all transition-duration-200"
            >
              Read Blog
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LandingComponent {
  readonly #store = inject(Store);

  teamMembers = this.#store.selectSignal(
    (state) => state.content.sections['team']
  );
}
