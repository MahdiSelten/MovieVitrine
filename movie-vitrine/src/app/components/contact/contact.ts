import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService, SpamCheckResponse } from '../../services/contact';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  contactForm: FormGroup;
  isLoading = false;
  spamResult = '';
  isSpam = false;

  constructor() {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.spamResult = '';
      this.isSpam = false;

      const spamRequest = {
        userId: 1, 
        userInput: this.contactForm.value.message
      };

      this.contactService.checkSpam(spamRequest).subscribe({
        next: (response: SpamCheckResponse) => {
          this.isLoading = false;
          this.spamResult = response.prediction;
          this.isSpam = this.isSpamPrediction(response.prediction);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error checking spam:', error);
          this.spamResult = 'Error checking message. Please try again.';
        }
      });
    }
  }

  private isSpamPrediction(prediction: string): boolean {
    const predictionStr = String(prediction).toLowerCase();
    return predictionStr.includes('spam') || 
           predictionStr === '1' ||
           predictionStr.includes('yes') ||
           predictionStr === 'true';
  }
}