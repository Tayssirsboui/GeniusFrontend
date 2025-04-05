import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8089/backend/api/test';  // Backend URL (adjust if needed)

  constructor(private http: HttpClient) { }

  // Fetch all tests
  getAllTests(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Fetch all questions for a specific test
  getQuestionsByTest(testId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${testId}`);
  }

  // Submit the test answers
  submitTest(quizData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit-test`, quizData);
  }

  // Fetch all test results
  getTestResults(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/test-result`);
  }
}
