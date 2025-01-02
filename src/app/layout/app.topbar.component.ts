import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  imports: [AppBreadcrumbComponent],
})
export class AppTopbarComponent {
  @ViewChild('menubutton') menuButton!: ElementRef;

  constructor(public layoutService: LayoutService) {}

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }
}
