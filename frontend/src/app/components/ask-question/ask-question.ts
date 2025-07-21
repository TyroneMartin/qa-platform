import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'qa-ask-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ask-question.html',
  styleUrls: ['./ask-question.css']
})
export class AskQuestionComponent {
  questionForm: FormGroup;
  isSubmitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      author: ['', Validators.required],
      tags: ['']
    });
  }

  onSubmit(): void {
    if (this.questionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = '';

      const formData = this.questionForm.value;
      
      // Process tags
      if (formData.tags) {
        formData.tags = formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      } else {
        formData.tags = [];
      }

      this.questionService.createQuestion(formData).subscribe({
        next: (question) => {
          this.router.navigate(['/questions', question._id]);
        },
        error: (error) => {
          console.error('Error creating question:', error);
          this.error = error.error?.message || 'Failed to create question. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.questionForm.controls).forEach(key => {
      const control = this.questionForm.get(key);
      control?.markAsTouched();
    });
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