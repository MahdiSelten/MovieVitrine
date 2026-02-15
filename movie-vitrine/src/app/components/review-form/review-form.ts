import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReviewService } from '../../services/review';
import { Review, ReviewRequest } from '../../models/review';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './review-form.html',
  styleUrls: ['./review-form.css']
})
export class ReviewForm {
  @Input() movieId: number | null = null;
  @Input() isLoggedIn: boolean = false;
  @Input() userId: number = 0;
  @Output() reviewAdded = new EventEmitter<Review>();

  reviewForm: FormGroup;
  isLoading = false;
  sentimentScore: number = 0; 
  isPositive = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit(): void {
    if (!this.movieId) {
      this.errorMessage = 'Movie information not available.';
      return;
    }

    if (this.reviewForm.valid && this.isLoggedIn) {
      this.isLoading = true;
      this.errorMessage = '';

      const reviewRequest: ReviewRequest = {
        userId: this.userId,
        userInput: this.reviewForm.value.content,
        movieId: this.movieId,
        rating: this.reviewForm.value.rating
      };

      // Analyze sentiment
      this.reviewService.analyzeReviewSentiment(reviewRequest).subscribe({
        next: (response) => {
          this.sentimentScore = response.prediction;
          this.isPositive = this.calculateIsPositive(response.prediction);
          
          console.log(`🎯 Sentiment Analysis: 
            Score: ${this.sentimentScore}
            Is Positive: ${this.isPositive}
            Interpretation: ${this.isPositive ? 'POSITIVE REVIEW' : 'NEGATIVE REVIEW'}`);

          const newReview: Review = {
            userId: this.userId.toString(),
            movieId: this.movieId!,
            content: this.reviewForm.value.content,
            rating: this.reviewForm.value.rating,
            sentiment: [this.sentimentScore], 
            isPositive: this.isPositive,
            userName: 'Current User'
          };

          this.reviewService.addReview(newReview).subscribe({
            next: (review) => {
              this.isLoading = false;
              this.reviewAdded.emit(review);
              this.reviewForm.reset({ rating: 5 });
              this.sentimentScore = 0;
            },
            error: (error) => {
              this.isLoading = false;
              this.errorMessage = 'Failed to submit review. Please try again.';
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to analyze review. Please try again.';
        }
      });
    }
  }

  private calculateIsPositive(prediction: number): boolean {
    return prediction > 0.5;
  }

  getConfidence(): number {
    if (this.isPositive) {
      return this.sentimentScore; 
    } else {
      return 1 - this.sentimentScore; 
    }
  }
}