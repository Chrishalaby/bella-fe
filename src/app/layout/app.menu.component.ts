import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppMenuitemComponent } from './app.menuitem.component';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  imports: [CommonModule, AppMenuitemComponent],
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Main',
        icon: 'pi pi-th-large',
        items: [
          {
            label: 'Landing',
            icon: 'pi pi-fw pi-globe',
            routerLink: ['/landing'],
          },
          {
            label: 'About Us',
            icon: 'pi pi-fw pi-user',
            routerLink: ['/about'],
          },
          {
            label: 'FAQ',
            icon: 'pi pi-fw pi-question',
            routerLink: ['/faq'],
          },
          {
            label: 'Contact Us',
            icon: 'pi pi-fw pi-phone',
            routerLink: ['/contact'],
          },
        ],
      },
    ];
  }
}
