import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { ContentState } from '../../store/state/section.state';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-12 text-center">
        Welcome to Our Platform
      </h1>

      <div class="space-y-16">
        <!-- <ng-container *ngFor="let section of sections">
          <div
            *ngIf="section.section === 'landing'"
            class="flex flex-col md:flex-row items-center gap-8 py-8"
          >
            <div class="flex-1 space-y-4">
              <h2 class="text-3xl font-semibold text-gray-800">
                {{ section.title }}
              </h2>
              <p class="text-lg text-gray-600 leading-relaxed">
                {{ section.text }}
              </p>
            </div>
            <div class="flex-1" *ngIf="section.imageUrl">
              <img
                [src]="section.imageUrl"
                [alt]="section.title || 'Section image'"
                class="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </ng-container> -->
      </div>

      <!-- Features Grid -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- <ng-container *ngFor="let section of sections">
            <div
              *ngIf="section.section === 'feature'"
              class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <div class="mb-4" *ngIf="section.imageUrl">
                <img
                  [src]="section.imageUrl"
                  [alt]="section.title || 'Feature image'"
                  class="w-full h-48 object-cover rounded-md"
                />
              </div>
              <h3 class="text-xl font-semibold mb-4">{{ section.title }}</h3>
              <p class="text-gray-600">{{ section.text }}</p>
            </div>
          </ng-container> -->
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background-color: #f9fafb;
      }
    `,
  ],
})
export class LandingComponent {
  readonly #store = inject(Store);

  sections = this.#store.selectSignal(ContentState.getAllSections);
}
