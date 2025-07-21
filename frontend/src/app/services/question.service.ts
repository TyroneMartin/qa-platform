import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Question {
  _id?: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  votes: number;
  views: number;
  answers: Answer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  _id?: string;
  content: string;
  author: string;
  votes: number;
  createdAt: Date;
}

export interface QuestionResponse {
  questions: Question[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalQuestions: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  // private apiUrl = 'http://localhost:3000/api/questions';
     private apiUrl = `${environment.apiUrl}/questions`;


  constructor(private http: HttpClient) { }

  // Get questions with pagination and search
  getQuestions(page: number = 1, limit: number = 20, search: string = '', sortBy: string = 'createdAt'): Observable<QuestionResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy);
    
    if (search.trim()) {
      params = params.set('search', search);
    }

    return this.http.get<QuestionResponse>(this.apiUrl, { params });
  }

  // Get single question
  getQuestion(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }

  // Create new question
  createQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question);
  }

  // Update question
  updateQuestion(id: string, question: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, question);
  }

  // Delete question
  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Add answer to question
  addAnswer(questionId: string, answer: Partial<Answer>): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/${questionId}/answers`, answer);
  }

  // Update answer
  updateAnswer(questionId: string, answerId: string, answer: Partial<Answer>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${questionId}/answers/${answerId}`, answer);
  }

  // Delete answer
  deleteAnswer(questionId: string, answerId: string): Observable<Question> {
    return this.http.delete<Question>(`${this.apiUrl}/${questionId}/answers/${answerId}`);
  }
}