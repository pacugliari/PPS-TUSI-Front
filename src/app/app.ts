import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalStore } from './global-store';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './modules/header/header.component';
import { FooterComponent } from './modules/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    HeaderComponent,
    FooterComponent,
  ],
  template: ` <app-header /><router-outlet /> <app-footer />`,
})
export class App {
  constructor(protected readonly globalStore: GlobalStore) {
    this.globalStore.loadData();
  }
}
