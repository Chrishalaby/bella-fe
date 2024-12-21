import { Routes } from '@angular/router';
import { SectionEditorComponent } from './pages/section-editor/section-editor.component';

export const routes: Routes = [
  { path: 'edit/:section', component: SectionEditorComponent },
];
