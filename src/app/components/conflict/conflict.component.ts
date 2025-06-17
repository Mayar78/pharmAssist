import { Component } from '@angular/core';
import { RecommendationService } from '../../services/recommendation.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-conflict',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './conflict.component.html',
  styleUrl: './conflict.component.css'
})
export class ConflictComponent {
 isLoading = true;
  response: any;
  error: string | null = null;

  constructor(private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.loadConflictingMedications();
  }

  loadConflictingMedications(): void {
    this.isLoading = true;
    this.error = null;
    
    this.recommendationService.getConflictingMedications().subscribe({
      next: (response) => {
        this.response = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load conflicting medications. Please try again later.';
        this.isLoading = false;
        console.error('Error loading conflicting medications:', err);
      }
    });
  }
}