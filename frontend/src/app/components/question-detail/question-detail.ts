import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Question, QuestionService } from '../../services/question.service';

@Component({
  selector: 'qa-question-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './question-detail.html',
  styleUrls: ['./question-detail.css']
})
export class QuestionDetailComponent implements OnInit {
  question: Question | null = null;
  loading = false;
  error = '';
  answerForm: FormGroup;
  isSubmittingAnswer = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private fb: FormBuilder
  ) {
    this.answerForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]],
      author: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadQuestion(id);
      }
    });
  }

  loadQuestion(id: string): void {
    this.loading = true;
    this.error = '';

    this.questionService.getQuestion(id).subscribe({
      next: (question) => {
        this.question = question;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading question:', error);
        this.error = 'Question not found or failed to load';
        this.loading = false;
      }
    });
  }

  submitAnswer(): void {
    if (this.answerForm.valid && !this.isSubmittingAnswer && this.question) {
      this.isSubmittingAnswer = true;

      const answerData = this.answerForm.value;
      
      this.questionService.addAnswer(this.question._id!, answerData).subscribe({
        next: (updatedQuestion) => {
          this.question = updatedQuestion;
          this.answerForm.reset();
          this.isSubmittingAnswer = false;
        },
        error: (error) => {
          console.error('Error submitting answer:', error);
          alert('Failed to submit answer. Please try again.');
          this.isSubmittingAnswer = false;
        }
      });
    }
  }

  deleteQuestion(): void {
    if (this.question && confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(this.question._id!).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error deleting question:', error);
          alert('Failed to delete question');
        }
      });
    }
  }

  deleteAnswer(answerId: string): void {
    if (this.question && confirm('Are you sure you want to delete this answer?')) {
      this.questionService.deleteAnswer(this.question._id!, answerId).subscribe({
        next: (updatedQuestion) => {
          this.question = updatedQuestion;
        },
        error: (error) => {
          console.error('Error deleting answer:', error);
          alert('Failed to delete answer');
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.answerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
