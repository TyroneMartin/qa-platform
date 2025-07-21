import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService, Question, QuestionResponse } from '../../services/question.service';
import { QuestionListComponent } from '../question-list/question-list';
import { PaginationComponent } from '../pagination/pagination';

@Component({
  selector: 'qa-home',
  standalone: true,
  imports: [CommonModule, RouterModule, QuestionListComponent, PaginationComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  questions: Question[] = [];
  loading = false;
  error = '';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  hasNextPage = false;
  hasPrevPage = false;
  totalQuestions = 0;
  
  // Search and filters
  searchQuery = '';
  sortBy = 'createdAt';

  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = parseInt(params['page']) || 1;
      this.searchQuery = params['search'] || '';
      this.sortBy = params['sortBy'] || 'createdAt';
      this.loadQuestions();
    });
  }

  loadQuestions(): void {
    this.loading = true;
    this.error = '';

    this.questionService.getQuestions(this.currentPage, 20, this.searchQuery, this.sortBy)
      .subscribe({
        next: (response: QuestionResponse) => {
          this.questions = response.questions;
          this.currentPage = response.pagination.currentPage;
          this.totalPages = response.pagination.totalPages;
          this.hasNextPage = response.pagination.hasNextPage;
          this.hasPrevPage = response.pagination.hasPrevPage;
          this.totalQuestions = response.pagination.totalQuestions;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading questions:', error);
          this.error = 'Failed to load questions. Please try again.';
          this.loading = false;
        }
      });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.updateQueryParams();
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 1;
    this.updateQueryParams();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        search: this.searchQuery || null,
        sortBy: this.sortBy !== 'createdAt' ? this.sortBy : null
      },
      queryParamsHandling: 'merge'
    });
  }

  deleteQuestion(id: string): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(id).subscribe({
        next: () => {
          this.loadQuestions();
        },
        error: (error) => {
          console.error('Error deleting question:', error);
          alert('Failed to delete question');
        }
      });
    }
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
