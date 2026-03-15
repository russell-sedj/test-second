import { Component, afterNextRender, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  isAdmin = false;
  showScrollTop = signal(false);

  constructor(router: Router) {
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      this.isAdmin = (e as NavigationEnd).urlAfterRedirects.startsWith('/admin');
    });

    afterNextRender(() => {
      import('aos').then(({ default: AOS }) => {
        AOS.init({
          duration: 700,
          once: true,
          easing: 'ease-out-cubic',
          offset: 80,
        });
      });

      window.addEventListener('scroll', () => {
        this.showScrollTop.set(window.scrollY > 400);
      }, { passive: true });
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
