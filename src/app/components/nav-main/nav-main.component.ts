import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  inject,
} from '@angular/core';
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
  styleUrl: './nav-main.component.css',
})
export class NavMainComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();

  // Component Properties
  isSidebarOpen: boolean = false;
  isAnimating: boolean = false;
  currentRoute: string = '';
  isMobile: boolean = false;
  // username!:string;

  username = sessionStorage.getItem('username');

  // Navigation Items with enhanced properties
  navItems: NavItem[] = [
    {
      id: 'medicines',
      label: 'medicines',
      icon: 'fa-solid fa-capsules',
      route: '/main/AllProducts',
    },
    {
      id: 'request',
      label: 'request',
      icon: 'fa-solid fa-file-medical',
      route: '/main/request',
      badge: 3,
    },
    {
      id: 'orders',
      label: 'orders',
      icon: 'fa-solid fa-clipboard-list',
      route: '/main/orders',
    },
    {
      id: 'cart',
      label: 'cart',
      icon: 'fa-solid fa-cart-shopping',
      route: '/main/cart',
      badge: 5,
    },
    {
      id: 'chatbot',
      label: 'chatbot',
      icon: 'fa-solid fa-robot',
      route: '/main/chatbot',
    },
    {
      id: 'profile',
      label: 'profile',
      icon: 'fa-solid fa-user-circle',
      route: '/main/profile',
    },
  ];

  constructor(private _router: Router) {
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
        const element = document.querySelector(
          `.nav-item:nth-child(${index + 1})`
        );
        if (element) {
          (element as HTMLElement).style.animationDelay = `${
            (index + 1) * 0.1
          }s`;
        }
      });
    }, 100);
  }

  private trackRouteChanges(): void {
    this._router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
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
    this.navItems.forEach((item) => {
      item.isActive = this.currentRoute.includes(item.route);
    });
  }

  private announceRouteChange(): void {
    const activeItem = this.navItems.find((item) => item.isActive);
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

    // Add body class for overlay
    if (this.isSidebarOpen && this.isMobile) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    // Reset animation flag after transition
    setTimeout(() => {
      this.isAnimating = false;
    }, 300);

    // Announce state change
    const state = this.isSidebarOpen ? 'مفتوح' : 'مغلق';
    this.announceToScreenReader(`شريط التنقل ${state}`);
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

      // Navigate with smooth transition
      this._router
        .navigate([item.route])
        .then(() => {
          // Close sidebar on mobile after navigation
          if (this.isMobile) {
            setTimeout(() => {
              this.closeSidebar();
            }, 150);
          }

          // Reset animation state
          setTimeout(() => {
            this.isAnimating = false;
          }, 300);
        })
        .catch((error) => {
          console.error('Navigation error:', error);
          this.isAnimating = false;
        });
    }
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this._router.navigate(['/auth/login']);
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

    // Close sidebar if clicked outside on mobile
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

    // Close sidebar with Escape
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

  /**
   * Announce messages to screen readers
   */
  private announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Get user greeting based on time
   */
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

  /**
   * Initialize keyboard shortcuts
   */
  private initializeKeyboardShortcuts(): void {
    // Add keyboard shortcuts help
    const shortcuts = {
      'Ctrl + B': 'Toggle Sidebar',
      Escape: 'Close Sidebar',
      'Arrow Keys': 'Navigate Menu',
      'Enter/Space': 'Select Item',
    };

    // Store shortcuts for help modal if needed
    (window as any).keyboardShortcuts = shortcuts;
  }

  /**
   * Handle theme changes (if needed)
   */
  toggleTheme(): void {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  /**
   * Get badge count for nav items
   */
  getBadgeCount(itemId: string): number | undefined {
    const item = this.navItems.find((nav) => nav.id === itemId);
    return item?.badge;
  }

  updateBadgeCount(itemId: string, count: number): void {
    const item = this.navItems.find((nav) => nav.id === itemId);
    if (item) {
      item.badge = count > 0 ? count : undefined;
    }
  }

  /**
   * Handle sidebar hover effects
   */
  onSidebarHover(isHovering: boolean): void {
    if (!this.isSidebarOpen && !this.isMobile && isHovering) {
      // Temporarily expand on hover when collapsed
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      if (sidebar) {
        sidebar.classList.toggle('hover-expand', isHovering);
      }
    }
  }

  /**
   * Export user preferences
   */
  exportPreferences(): string {
    return JSON.stringify({
      sidebarOpen: this.isSidebarOpen,
      theme: localStorage.getItem('theme'),
      lastRoute: this.currentRoute,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Import user preferences
   */
  importPreferences(preferences: string): void {
    try {
      const prefs = JSON.parse(preferences);
      this.isSidebarOpen = prefs.sidebarOpen || false;
      if (prefs.theme) {
        document.documentElement.setAttribute('data-theme', prefs.theme);
      }
    } catch (error) {
      console.error('Error importing preferences:', error);
    }
  }
}
