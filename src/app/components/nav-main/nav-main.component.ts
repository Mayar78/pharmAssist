import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  isActive?: boolean;
  badge?: number;
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
  private readonly _router = inject(Router);
  
  // Component Properties
  isSidebarOpen: boolean = false;
  isAnimating: boolean = false;
  currentRoute: string = '';
  isMobile: boolean = false;
  showLogoutConfirmation = false;
  logoutInProgress = false;
  
  username = sessionStorage.getItem('username');
  
  // Navigation Items
  navItems: NavItem[] = [
    {
      id: 'medicines',
      label: 'medicines',
      icon: 'fa-solid fa-capsules',
      route: '/main/AllProducts'
    },
    {
      id: 'request',
      label: 'request',
      icon: 'fa-solid fa-file-medical',
      route: '/main/request',
      badge: 3
    },
    {
      id: 'orders',
      label: 'orders',
      icon: 'fa-solid fa-clipboard-list',
      route: '/main/orders'
    },
    {
      id: 'cart',
      label: 'cart',
      icon: 'fa-solid fa-cart-shopping',
      route: '/main/cart',
      badge: 5
    },
    {
      id: 'chatbot',
      label: 'chatbot',
      icon: 'fa-solid fa-robot',
      route: '/main/chatbot'
    },
    {
      id: 'profile',
      label: 'profile',
      icon: 'fa-solid fa-user-circle',
      route: '/main/profile'
    },
  ];

  constructor() {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.trackRouteChanges();
    this.setInitialRoute();
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private initializeComponent(): void {
    setTimeout(() => {
      this.navItems.forEach((_, index) => {
        const element = document.querySelector(`.nav-item:nth-child(${index + 1})`);
        if (element) {
          (element as HTMLElement).style.animationDelay = `${(index + 1) * 0.1}s`;
        }
      });
    }, 100);
  }

  private trackRouteChanges(): void {
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this._destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updateActiveStates();
        this.announceRouteChange();
      });
  }

  private setInitialRoute(): void {
    this.currentRoute = this._router.url;
    this.updateActiveStates();
  }

  private updateActiveStates(): void {
    this.navItems.forEach(item => {
      item.isActive = this.currentRoute.includes(item.route);
    });
  }

  private announceRouteChange(): void {
    const activeItem = this.navItems.find(item => item.isActive);
    if (activeItem) {
      this.announceForScreenReader(`Navigated to ${activeItem.label}`);
    }
  }

  // Updated and fixed screen reader announcement function
  private announceForScreenReader(message: string): void {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => liveRegion.textContent = '', 1000);
    }
  }

  toggleSidebar(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.isSidebarOpen = !this.isSidebarOpen;
    
    if (this.isSidebarOpen && this.isMobile) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
    
    this.announceForScreenReader(`Sidebar ${this.isSidebarOpen ? 'opened' : 'closed'}`);
  }

  closeSidebar(): void {
    if (this.isSidebarOpen) {
      this.isSidebarOpen = false;
      document.body.classList.remove('sidebar-open');
    }
  }

  navigateToRoute(item: NavItem): void {
    if (item.route && !this.isAnimating) {
      this.isAnimating = true;
      
      this._router.navigate([item.route]).then(() => {
        if (this.isMobile) {
          setTimeout(() => {
            this.closeSidebar();
          }, 150);
        }
        
        setTimeout(() => {
          this.isAnimating = false;
        }, 300);
      }).catch(error => {
        console.error('Navigation error:', error);
        this.isAnimating = false;
      });
    }
  }

  logout(): void {
    this.showLogoutConfirmation = true;
    this.announceForScreenReader('Logout confirmation dialog opened');
  }

  confirmLogout(): void {
    this.logoutInProgress = true;
    this.announceForScreenReader('Logging out, please wait');
    
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      
      this._router.navigate(['/auth/login']).then(() => {
        this.announceForScreenReader('Logged out successfully');
        this.logoutInProgress = false;
        this.showLogoutConfirmation = false;
      });
    }, 1000);
  }

  cancelLogout(): void {
    this.showLogoutConfirmation = false;
    this.announceForScreenReader('Logout cancelled');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const sidebar = document.querySelector('.sidebar');
    const clickedInside = sidebar?.contains(target);
    
    if (!clickedInside && this.isSidebarOpen && this.isMobile) {
      this.closeSidebar();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'b') {
      event.preventDefault();
      this.toggleSidebar();
    }
    
    if (event.key === 'Escape' && this.isSidebarOpen) {
      this.closeSidebar();
    }
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    
    if (this.isMobile) {
      this.isSidebarOpen = false;
      document.body.classList.remove('sidebar-open');
    } else if (window.innerWidth > 1024) {
      this.isSidebarOpen = true;
    }
  }

  getAnimationDelay(index: number): string {
    return `${(index + 1) * 0.1}s`;
  }

  isRouteActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }

  getTooltipText(item: NavItem): string {
    return item.label;
  }

  getUserGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }

  private manageFocus(): void {
    if (this.isSidebarOpen) {
      setTimeout(() => {
        const firstNavItem = document.querySelector('.nav-link') as HTMLElement;
        if (firstNavItem) {
          firstNavItem.focus();
        }
      }, 100);
    }
  }

  getBadgeCount(itemId: string): number | undefined {
    const item = this.navItems.find(nav => nav.id === itemId);
    return item?.badge;
  }

  updateBadgeCount(itemId: string, count: number): void {
    const item = this.navItems.find(nav => nav.id === itemId);
    if (item) {
      item.badge = count > 0 ? count : undefined;
    }
  }
}