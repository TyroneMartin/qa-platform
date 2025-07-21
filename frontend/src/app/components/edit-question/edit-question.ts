import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Question, QuestionService } from '../../services/question.service';

@Component({
  selector: 'qa-edit-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-question.html',
  styleUrls: ['./edit-question.css']
})
export class EditQuestionComponent implements OnInit {
  questionForm: FormGroup;
  question: Question | null = null;
  isLoading = false;
  isSubmitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private questionService: QuestionService
  ) {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      tags: ['']
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
    this.isLoading = true;
    this.questionService.getQuestion(id).subscribe({
      next: (question) => {
        this.question = question;
        this.questionForm.patchValue({
          title: question.title,
          content: question.content,
          tags: question.tags.join(', ')
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading question:', error);
        this.error = 'Failed to load question';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.questionForm.valid && !this.isSubmitting && this.question) {
      this.isSubmitting = true;
      this.error = '';

      const formData = this.questionForm.value;
      
      // Process tags
      if (formData.tags) {
        formData.tags = formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      } else {
        formData.tags = [];
      }

      this.questionService.updateQuestion(this.question._id!, formData).subscribe({
        next: (updatedQuestion) => {
          this.router.navigate(['/questions', updatedQuestion._id]);
        },
        error: (error) => {
          console.error('Error updating question:', error);
          this.error = error.error?.message || 'Failed to update question. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.questionForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.questionForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${fieldName} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }
}