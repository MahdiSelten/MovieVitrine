import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../models/review';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list.html',
  styleUrls: ['./review-list.css']
})
export class ReviewList {
  @Input() reviews: Review[] = [];
}