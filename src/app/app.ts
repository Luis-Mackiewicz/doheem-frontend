import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';
import { ButtonComponent } from './button/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
