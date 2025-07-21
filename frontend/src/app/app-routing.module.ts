import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { QuestionDetailComponent } from './components/question-detail/question-detail';
import { AskQuestionComponent } from './components/ask-question/ask-question';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'questions/:id', component: QuestionDetailComponent },
  { path: 'ask', component: AskQuestionComponent },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./components/edit-question/edit-question').then(m => m.EditQuestionComponent)
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }