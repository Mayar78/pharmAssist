import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-nav-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-main.component.html',
  styleUrl: './nav-main.component.css'
})
export class NavMainComponent implements OnInit, OnDestroy {
  
  private readonly _destroy$ = new Subject<void>();
  
  // Component Properties - Sidebar toggle functionality
  isSidebarOpen: boolean = false; // Start collapsed
  isAnimating: boolean = false;
  currentRoute: string = '';
  
  // Navigation Items
  navItems: NavItem[] = [
    {
      id: 'medicines',
      label: 'Medicines',
      icon: 'fa-solid fa-capsules',
      route: '/main/AllProducts'
    },
    {
      id: 'request',
      label: 'Request',
      icon: 'fa-solid fa-file-medical',
      route: '/main/request'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: 'fa-solid fa-clipboard-list',
      route: '/main/orders'
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: 'fa-solid fa-cart-shopping',
      route: '/main/cart'
    },
    {
      id: 'chatbot',
      label: 'ChatBot',
      icon: 'fa-solid fa-robot',
      route: '/main/chatbot'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'fa-solid fa-user-circle',
      route: '/main/profile'
    }
  ];

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.trackRouteChanges();
    this.setInitialRoute();
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Track route changes to update active states
   */
  private trackRouteChanges(): void {
    this._router.events
      .pipe(
       filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this._destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updateActiveStates();
      });
  }

  /**
   * Set initial route
   */
  private setInitialRoute(): void {
    this.currentRoute = this._router.url;
    this.updateActiveStates();
  }

  /**
   * Update active states for navigation items
   */
  private updateActiveStates(): void {
    this.navItems.forEach(item => {
      item.isActive = this.currentRoute.includes(item.route);
    });
  }

  /**
   * Toggle sidebar open/close
   */
  toggleSidebar(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.isSidebarOpen = !this.isSidebarOpen;
    
    // Reset animation flag after transition
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  /**
   * Navigate to route and close sidebar on mobile if needed
   */
  navigateToRoute(item: NavItem): void {
    if (item.route) {
      this._router.navigate([item.route]);
      
      // Close sidebar on mobile after navigation
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          this.isSidebarOpen = false;
        }, 150);
      }
    }
  }

  /**
   * Close sidebar when clicking outside (mobile)
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const sidebar = document.querySelector('.sidebar');
    const clickedInside = sidebar?.contains(target);
    
    // Close sidebar if clicked outside on mobile
    if (!clickedInside && this.isSidebarOpen && window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  /**
   * Handle window resize
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  /**
   * Check screen size and adjust sidebar behavior
   */
  private checkScreenSize(): void {
    if (window.innerWidth > 1024) {
      // Keep current state on large screens
    } else if (window.innerWidth <= 768) {
      // Start collapsed on mobile
      this.isSidebarOpen = false;
    }
  }

  /**
   * Get animation delay for nav items
   */
  getAnimationDelay(index: number): string {
    return `${(index + 1) * 0.1}s`;
  }

  /**
   * Check if current route is active
   */
  isRouteActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }

  /**
   * Get tooltip text for collapsed nav items
   */
  getTooltipText(item: NavItem): string {
    return item.label;
  }
}