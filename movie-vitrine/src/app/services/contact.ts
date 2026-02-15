import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface SpamCheckRequest {
  userId: number;
  userInput: string;
}

export interface SpamCheckResponse {
  prediction: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000';

  checkSpam(spamRequest: SpamCheckRequest): Observable<SpamCheckResponse> {
    console.log('🔄 Sending spam check request to:', `${this.apiUrl}/predictmail`);
    console.log('📤 Request data:', spamRequest);
    
    return this.http.post<SpamCheckResponse>(`${this.apiUrl}/predictmail`, spamRequest)
      .pipe(
        tap({
          next: (response) => console.log('✅ Received response:', response),
          error: (error) => console.error('❌ Request failed:', error)
        })
      );
  }
}