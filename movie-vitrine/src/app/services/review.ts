import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Review, ReviewRequest, ReviewResponse } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000';

  analyzeReviewSentiment(reviewRequest: ReviewRequest): Observable<ReviewResponse> {
  return this.http.post<ReviewResponse>(`${this.apiUrl}/predictreviewRNN`, reviewRequest);
}
  getMovieReviews(movieId: number): Observable<Review[]> {
    return new Observable<Review[]>(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  addReview(review: Review): Observable<Review> {
    return new Observable<Review>(observer => {
      const newReview = {
        ...review,
        _id: 'mock_' + Date.now(),
        createdAt: new Date()
      };
      observer.next(newReview);
      observer.complete();
    });
  }
}