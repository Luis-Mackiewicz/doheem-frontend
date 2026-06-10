import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header';
import { ToastComponent } from './components/toast/toast';
import { ThemeService } from './services/theme-service';
import { LucideSun, LucideMoon } from '@lucide/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ToastComponent, LucideSun, LucideMoon],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected showHeader = true;

  constructor(
    router: Router,
    protected theme: ThemeService,
  ) {
    router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.showHeader = !e.url.startsWith('/groups/');
    });
  }
}
