import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./components/home/home').then(m => m.HomeComponent)
  },
  { 
    path: 'questions/:id', 
    loadComponent: () => import('./components/question-detail/question-detail').then(m => m.QuestionDetailComponent)
  },
  { 
    path: 'ask', 
    loadComponent: () => import('./components/ask-question/ask-question').then(m => m.AskQuestionComponent)
  },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./components/edit-question/edit-question').then(m => m.EditQuestionComponent)
  },
  { path: '**', redirectTo: '/home' }
];