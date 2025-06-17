import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

interface CarouselItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
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
  imports: [RouterModule, CarouselModule],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.css'
})
export class FeatureCardComponent {
  constructor(private router: Router) {}

  currentSlide = signal(0);
  autoSlideInterval: any;

  // Enhanced carousel items with better content
  carouselItems: CarouselItem[] = [
    {
      id: 1,
      imageUrl: 'assets/imgs/car1.jpeg',
      title: 'Welcome to Our Pharmacy',
      description: 'Your health is our priority - we provide the best medicines and medical services'
    },
    {
      id: 2,
      imageUrl: 'assets/imgs/car1 (2).jpeg',
      title: 'High-Quality Medicines',
      description: 'We guarantee original medicines from the best international companies'
    },
    {
      id: 3,
      imageUrl: 'assets/imgs/car3.jpeg',
      title: 'Expert Medical Consultation',
      description: 'Team of specialized pharmacists to provide appropriate medical advice'
    },
    {
      id: 4,
      imageUrl: 'assets/imgs/car4.jpeg',
      title: 'Fast & Secure Delivery',
      description: 'Reliable and fast delivery service to ensure medicine arrives on time'
    }
  ];

  // Feature cards
  featureCards: FeatureCard[] = [
    {
      id: 1,
      title: 'My Recommendations',
      description: 'Get personalized medical recommendations for your health condition',
      buttonText: 'Get Recommendations',
      iconClass: 'fa-solid fa-pills',
      gradientClass: 'gradient-blue',
      action: () => this.router.navigate(['/main/MyRecommendation'])
    },
   
    {
      id: 2,
      title: 'Conflict medicines',
  description: 'Conflict medicines are medicines that may interact with each other',      buttonText: 'Check Interactions',
      iconClass: 'fa-solid fa-triangle-exclamation',
      gradientClass: 'gradient-purple',
      action: () => this.router.navigate(['/main/Conflict'])
    },
    {
      id: 3,
      title: 'Safety Summary',
      description: 'Quick overview of important medication safety information',
      buttonText: 'View Summary',
      iconClass: 'fa-solid fa-clipboard-check',
      gradientClass: 'gradient-cyan',
      action: () => this.router.navigate(['/main/safety'])
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
    }, 5000); // Increased interval for better UX
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

  // Enhanced error handling for images
  onImageError(event: any): void {
    console.error('Failed to load image:', event.target.src);
    event.target.src = 'assets/images/placeholder.jpg';
    event.target.onerror = null; // Prevent infinite error loop
  }

  onImageLoad(event: any): void {
    console.log('Image loaded successfully:', event.target.src);
  }

  // Owl Carousel options
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 600,
    navText: ['', ''],
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  };
}