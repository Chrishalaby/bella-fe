import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-blog-detail',
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="card px-4 py-8 md:px-6 lg:px-8">
      @if (blogPost(); as post) {
      <div class="surface-card p-4 border-round shadow-2">
        @if (post.imageUrl) {
        <img [src]="post.imageUrl" class="w-full border-round mb-4" />
        }
        <div class="text-900 font-bold text-4xl mb-4">{{ post.title }}</div>
        <div class="text-sm text-600 mb-4">
          Posted on {{ post.createdAt | date : 'fullDate' }}
        </div>
        <div class="line-height-3" [innerHTML]="post.text"></div>

        <div class="mt-4 pt-4 border-top-1 border-300">
          <button
            pButton
            label="Back to Blog"
            routerLink="/blog"
            class="p-button-text"
          ></button>
        </div>
      </div>
      }
    </div>
  `,
  styleUrl: './blog-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailComponent {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  blogPost = computed(() => {
    const posts = this.store.selectSignal(
      (state) => state.content.sections['blog']
    )();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return posts?.find((post: any) => post.id === id);
  });
}
