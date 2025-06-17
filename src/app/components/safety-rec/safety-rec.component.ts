import { Component } from '@angular/core';
import { IncompleteProfileResponse, RecommendationService, SafetySummaryResponse } from '../../services/recommendation.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-safety-rec',
  standalone: true,
  
  imports: [DatePipe,CommonModule],
  templateUrl: './safety-rec.component.html',
  styleUrl: './safety-rec.component.css'
})
export class SafetyRecComponent {
  isLoading = true;
  safetySummary: any;
  error: string | null = null;

  constructor(private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.loadSafetySummary();
  }

  loadSafetySummary(): void {
    this.isLoading = true;
    this.error = null;
    
    this.recommendationService.getSafetySummary().subscribe({
      next: (response) => {
        this.safetySummary = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load safety summary. Please try again later.';
        this.isLoading = false;
        console.error('Error loading safety summary:', err);
      }
    });
  }
}