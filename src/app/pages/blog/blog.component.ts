import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-blog',
  imports: [RouterModule, ButtonModule, DatePipe],
  template: ` <div class="card px-4 py-8 md:px-6 lg:px-8">
    <div class="text-900 font-bold text-4xl mb-4 text-center">Blog Posts</div>
    <div class="grid">
      @for (post of blogPosts(); track post.id) {
      <div class="col-12 lg:col-4 p-3">
        <div class="surface-card border-round shadow-2">
          @if (post.imageUrl) {
          <img [src]="post.imageUrl" class="w-full border-round-top" />
          }
          <div class="p-4">
            <div class="font-medium text-xl mb-3 text-900">
              {{ post.title }}
            </div>
            <!-- <div class="line-height-3 mb-3" [innerHTML]="post.text"></div> -->
            <div class="flex align-items-center">
              <span class="text-sm">{{ post.createdAt | date }}</span>
              <a [routerLink]="['/blog', post.id]" class="ml-auto">
                <button
                  pButton
                  label="Read More"
                  class="p-button-text"
                ></button>
              </a>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  </div>`,
  styleUrl: './blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent {
  private store = inject(Store);

  blogPosts = this.store.selectSignal(
    (state) => state.content.sections['blog']
  );
}
