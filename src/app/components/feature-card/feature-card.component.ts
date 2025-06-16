import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
interface CarouselItem {
  id: number;
  imageUrl: string;
  title?: string;
  description?: string;
}

interface FeatureCard {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  iconClass: string;
  gradientClass: string;

  action: () => void;
}
@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.css'
})
export class FeatureCardComponent {
  constructor(private router: Router) {}
currentSlide = signal(0);
  autoSlideInterval: any;

  // Carousel items - you can replace these with your actual images
  carouselItems: CarouselItem[] = [
    {
      id: 1,
      imageUrl: './../../../assets/imgs/car1.jpeg',
      title: 'Welcome to Our Pharmacy',
      description: 'Your health is our priority'
    },
    {
      id: 2,
      imageUrl: './../../../assets/imgs/car1 (2).jpeg',
      title: 'Quality Medicines',
      description: 'Trusted brands and products'
    },
    {
      id: 3,
      imageUrl: './../../../assets/imgs/car3.jpeg',
      title: 'Expert Consultation',
      description: 'Professional healthcare advice'
    },
    {
      id: 4,
      imageUrl: './../../../assets/imgs/medicines.png',
      title: 'Fast Delivery',
      description: 'Quick and reliable service'
    }
  ];

  // Feature cards
  featureCards: FeatureCard[] = [
    {
      id: 1,
      title: 'My Recommendations',
      description: 'Get recommended medicines',
      buttonText: 'Get recommendation',
      iconClass: 'fa-solid fa-pills',
      gradientClass: 'gradient-blue',
       action: () => this.router.navigate(['/main/MyRecommendation'])
    },
    {
      id: 2,
      title: 'Check product safety',
      description: 'Check product safety and get detailed information',
      buttonText: 'Product safety',
      iconClass: 'fa-solid fa-shield-heart',
      gradientClass: 'gradient-orange',
        action: () => this.router.navigate(['/recommendations'])
    },
    {
      id: 3,
      title: 'Conflict medicines',
      description: 'Conflict medicines are medicines that may interact with each other',
      buttonText: 'Conflict medicines',
      iconClass: 'fa-solid fa-triangle-exclamation',
      gradientClass: 'gradient-purple',
    action: () => this.router.navigate(['/recommendations'])
    },
    {
      id: 4,
      title: 'Safety summary',
      description: 'Safety summary provides a quick overview of important safety information',
      buttonText: 'Safety summary',
      iconClass: 'fa-solid fa-clipboard-check',
      gradientClass: 'gradient-cyan',
    action: () => this.router.navigate(['/recommendations'])
    }
  ];

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  // Carousel methods
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide.update(current => 
      current >= this.carouselItems.length - 1 ? 0 : current + 1
    );
  }

  prevSlide(): void {
    this.currentSlide.update(current => 
      current <= 0 ? this.carouselItems.length - 1 : current - 1
    );
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
  }

  // Feature card actions
  getRecommendations(): void {
    console.log('Getting recommendations...');
    
    // Navigate to recommendations page or open modal
  }

  checkProductSafety(): void {
    console.log('Checking product safety...');
    // Navigate to product safety page
  }

  checkConflictMedicines(): void {
    console.log('Checking conflict medicines...');
    // Navigate to conflict medicines page
  }

  getSafetySummary(): void {
    console.log('Getting safety summary...');
    // Navigate to safety summary page
  }
}
