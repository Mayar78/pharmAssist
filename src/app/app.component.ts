import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthComponent } from "./layouts/auth/auth.component";
import { MainComponent } from "./layouts/main/main.component";
import { FooterComponent } from "./components/footer/footer.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuthComponent, MainComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { constructor(private router: Router) {
    this.router.events.subscribe(event => {
      console.log('Router event:', event);
    });
  }
  title = 'pharmAssist';
}
