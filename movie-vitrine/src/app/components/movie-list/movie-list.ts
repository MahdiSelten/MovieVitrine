import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Movie, MovieService } from '../../services/movie';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.css']
})
export class MovieList implements OnInit {
  movies: Movie[] = [];
  isLoading = true;
  error = '';

  constructor(
    private movieService: MovieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.error = '';
    
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading movies:', error);
        this.error = 'Failed to load movies. Please try again.';
        this.isLoading = false;
        
        this.fallbackToMockData();
      }
    });
  }

  private fallbackToMockData(): void {
    console.log('🔄 Falling back to mock data...');
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: "Inception",
        original_title: "Inception",
        overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        release_date: "2010-07-16",
        popularity: 8.8,
        vote_average: 8.4,
        vote_count: 35000,
        budget: 160000000,
        revenue: 836836967,
        runtime: 148,
        status: "Released",
        tagline: "Your mind is the scene of the crime.",
        original_language: "en",
        homepage: "https://www.warnerbros.com/movies/inception",
        director: "Christopher Nolan",
      }
    ];
    this.movies = mockMovies;
  }

  goToMovieDetail(movieId: number): void {
  const movie = this.movies.find(m => m.id === movieId);
  const backendId = movie?.index || movieId;
  this.router.navigate(['/movie', backendId]);
}
}