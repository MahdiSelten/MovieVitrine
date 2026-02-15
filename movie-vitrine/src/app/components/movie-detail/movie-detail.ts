import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Movie, MovieService } from '../../services/movie';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/review';
import { AuthService } from '../../services/auth';
import { ReviewForm } from '../review-form/review-form';
import { ReviewList } from '../review-list/review-list';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReviewForm, ReviewList],
  templateUrl: './movie-detail.html',
  styleUrls: ['./movie-detail.css']
})
export class MovieDetail implements OnInit {
  movie: Movie | undefined;
  reviews: Review[] = [];
  isLoading = true;
  error = '';
  currentUserId = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie(id);
    this.loadReviews(id);
  }

  loadMovie(id: number): void {
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = `Movie not found or error loading details: ${error.message}`;
        this.isLoading = false;
      }
    });
  }

  loadReviews(movieId: number): void {
    this.reviewService.getMovieReviews(movieId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  onReviewAdded(review: Review): void {
    this.reviews.unshift(review); // Add new review at the beginning
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}