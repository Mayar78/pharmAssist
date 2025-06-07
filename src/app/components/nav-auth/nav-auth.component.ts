import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-auth',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,],
  templateUrl: './nav-auth.component.html',
  styleUrl: './nav-auth.component.css'
})
export class NavAuthComponent {
  isScrolling:boolean=false;
  @HostListener('window:scroll',[])
  onwindowscroll()
  {
    this.isScrolling=window.scrollY > 30;
  }

}
