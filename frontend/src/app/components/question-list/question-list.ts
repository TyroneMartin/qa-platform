import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Question } from '../../services/question.service';

@Component({
  selector: 'qa-question-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './question-list.html',
  styleUrls: ['./question-list.css']
})
export class QuestionListComponent {
  @Input() questions: Question[] = [];
  @Output() deleteQuestion = new EventEmitter<string>();

  onDelete(questionId: string): void {
    this.deleteQuestion.emit(questionId);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
}