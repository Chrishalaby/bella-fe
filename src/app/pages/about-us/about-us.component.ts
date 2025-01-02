import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent {
  private store = inject(Store);

  aboutContent = this.store.selectSignal(
    (state) => state.content.sections['about']?.[0]
  );

  teamMembers = this.store.selectSignal(
    (state) => state.content.sections['team']
  );

  constructor() {
    effect(() => {
      console.log('AboutUsComponent initialized', this.teamMembers());
    });
  }
}
