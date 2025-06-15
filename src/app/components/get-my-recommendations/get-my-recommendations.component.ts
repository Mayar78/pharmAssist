import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recommendation, RecommendationFilter, RecommendationService, RecommendationsResponse } from '../../services/recommendation.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-get-my-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './get-my-recommendations.component.html',
  styleUrl: './get-my-recommendations.component.css'
})
export class GetMyRecommendationsComponent implements OnInit, OnDestroy {
  recommendationsData: RecommendationsResponse | null = null;
  recommendations: Recommendation[] = [];
  filteredRecommendations: Recommendation[] = [];
  availableIngredients: RecommendationFilter[] = [];
  
  // Loading and error states
  isLoading = false;
  isLoadingIngredients = false;
  error: string | null = null;
  
  // Search and filter properties
  searchTerm = '';
  selectedConflictStatus = 'all'; // 'all', 'safe', 'conflicted'
  selectedIngredients: string[] = [];
  sortBy = 'finalScore'; // 'finalScore', 'safetyScore', 'effectivenessScore', 'productPrice', 'productName'
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Score range filter
  scoreRange = {
    min: 0,
    max: 5,
    selectedMin: 0,
    selectedMax: 5
  };
  
  // Pagination properties
  currentPage = 0;
  pageSize = 12;
  totalItems = 0;
  
  // View mode
  viewMode: 'grid' | 'list' = 'grid';
  
  // RxJS
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  
  // Sort options
  sortOptions = [
    { value: 'finalScore', label: 'Final Score', icon: '⭐' },
    { value: 'safetyScore', label: 'Safety Score', icon: '🛡️' },
    { value: 'effectivenessScore', label: 'Effectiveness Score', icon: '⚡' },
    { value: 'productPrice', label: 'Price', icon: '💰' },
    { value: 'productName', label: 'Name', icon: '📋' }
  ];

  constructor(private recommendationsService: RecommendationService) {}

  ngOnInit(): void {
    this.initializeComponent();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Computed properties for template
  get safeItemsCount(): number {
    return this.recommendations.filter(rec => !rec.hasConflict).length;
  }

  get conflictedItemsCount(): number {
    return this.recommendations.filter(rec => rec.hasConflict).length;
  }

  private initializeComponent(): void {
    this.loadRecommendations();
    this.loadIngredients();
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 0;
      this.applyFilters();
    });
  }

  loadRecommendations(): void {
    this.isLoading = true;
    this.error = null;
    
    this.recommendationsService.getMyRecommendations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.recommendationsData = response;
          this.recommendations = response.recommendations;
          this.totalItems = response.recommendations.length;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to load recommendations. Please try again.';
          this.isLoading = false;
          console.error('Error loading recommendations:', error);
        }
      });
  }

  loadIngredients(): void {
    this.isLoadingIngredients = true;
    
    this.recommendationsService.getRecommendationIngredients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ingredients) => {
          this.availableIngredients = ingredients;
          this.isLoadingIngredients = false;
        },
        error: (error) => {
          console.error('Error loading ingredients:', error);
          this.isLoadingIngredients = false;
        }
      });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  onConflictStatusChange(status: string): void {
    this.selectedConflictStatus = status;
    this.currentPage = 0;
    this.applyFilters();
  }

  onIngredientToggle(ingredient: string): void {
    const index = this.selectedIngredients.indexOf(ingredient);
    if (index > -1) {
      this.selectedIngredients.splice(index, 1);
    } else {
      this.selectedIngredients.push(ingredient);
    }
    this.currentPage = 0;
    this.applyFilters();
  }

  onSortChange(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortDirection = 'desc';
    }
    this.applyFilters();
  }

  onScoreRangeChange(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: string): void {
    this.pageSize = parseInt(size, 10);
    this.currentPage = 0;
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  private applyFilters(): void {
    let filtered = [...this.recommendations];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(rec => 
        rec.productName.toLowerCase().includes(searchLower) ||
        rec.productDescription.toLowerCase().includes(searchLower) ||
        rec.activeIngredient.toLowerCase().includes(searchLower)
      );
    }

    // Apply conflict status filter
    if (this.selectedConflictStatus !== 'all') {
      const isConflicted = this.selectedConflictStatus === 'conflicted';
      filtered = filtered.filter(rec => rec.hasConflict === isConflicted);
    }

    // Apply ingredients filter
    if (this.selectedIngredients.length > 0) {
      filtered = filtered.filter(rec => 
        this.selectedIngredients.some(ingredient => 
          rec.activeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      );
    }

    // Apply score range filter
    filtered = filtered.filter(rec => 
      rec.finalScore >= this.scoreRange.selectedMin && 
      rec.finalScore <= this.scoreRange.selectedMax
    );

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA: any = (a as any)[this.sortBy];
      let valueB: any = (b as any)[this.sortBy];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (this.sortDirection === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });

    // Update filtered results
    this.filteredRecommendations = filtered;
    this.totalItems = filtered.length;
  }

  getPaginatedRecommendations(): Recommendation[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.filteredRecommendations.slice(startIndex, startIndex + this.pageSize);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getScoreColor(score: number): string {
    if (score >= 4.5) return '#10b981'; // green
    if (score >= 4.0) return '#3b82f6'; // blue
    if (score >= 3.5) return '#f59e0b'; // amber
    if (score >= 3.0) return '#f97316'; // orange
    return '#ef4444'; // red
  }

  getScoreIcon(score: number): string {
    if (score >= 4.5) return '🌟';
    if (score >= 4.0) return '⭐';
    if (score >= 3.5) return '✨';
    if (score >= 3.0) return '💫';
    return '⚡';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedConflictStatus = 'all';
    this.selectedIngredients = [];
    this.scoreRange.selectedMin = this.scoreRange.min;
    this.scoreRange.selectedMax = this.scoreRange.max;
    this.currentPage = 0;
    this.applyFilters();
  }

  retryLoadRecommendations(): void {
    this.loadRecommendations();
  }

  // Utility methods
  formatPrice(price: number): string {
    return `${price.toFixed(2)}`;
  }

  formatScore(score: number): string {
    return score.toFixed(1);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Helper methods for template properties that may not exist
  getRecordDate(rec: Recommendation): string {
    // Check for various possible date properties
    const dateValue = (rec as any).dateAdded || (rec as any).createdAt || (rec as any).updatedAt || new Date().toISOString();
    return this.formatDate(dateValue);
  }

  getRecordCategory(rec: Recommendation): string {
    // Return category if it exists, otherwise determine from activeIngredient
    if ((rec as any).category) {
      return (rec as any).category;
    }
    
    // Fallback: determine category from active ingredient
    const ingredient = rec.activeIngredient.toLowerCase();
    if (ingredient.includes('retinol') || ingredient.includes('vitamin c')) return 'serum';
    if (ingredient.includes('acid') || ingredient.includes('peel')) return 'treatment';
    if (ingredient.includes('hyaluronic') || ingredient.includes('moistur')) return 'hydrator';
    if (ingredient.includes('natural') || ingredient.includes('botanical')) return 'natural';
    if (ingredient.includes('supplement') || ingredient.includes('vitamin')) return 'supplement';
    return 'treatment'; // default
  }

  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'serum': 'fa-flask',
      'treatment': 'fa-spa',
      'hydrator': 'fa-tint',
      'natural': 'fa-leaf',
      'supplement': 'fa-pills'
    };
    return iconMap[category] || 'fa-spa';
  }
}