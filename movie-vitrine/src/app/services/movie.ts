import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

export interface Movie {
  id: number;
  index?: number; 
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  original_language: string;
  homepage: string;
  director: string;
}

interface MoviesResponse {
  movies: Movie[];
}

interface MovieResponse {
  selectedMovie: Movie;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000';

  getMovies(): Observable<Movie[]> {
    console.log('🎬 Fetching all movies from backend...');
    return this.http.get<MoviesResponse>(`${this.apiUrl}/allmovies`)
      .pipe(
        map(response => {
          console.log('✅ Movies received:', response.movies);
          return response.movies;
        })
      );
  }

  getMovieById(id: number): Observable<Movie> {
  console.log(`🎬 Fetching movie with ID: ${id}`);
  
  return this.http.post<MovieResponse>(`${this.apiUrl}/onemovie`, { movieId: id })
    .pipe(
      map(response => {
        if (!response.selectedMovie) {
          throw new Error(`Movie with ID ${id} not found`);
        }
        return response.selectedMovie;
      }),
      catchError(error => {
        console.log('🔄 First attempt failed, trying alternative...');
        throw error;
      })
    );
}
}