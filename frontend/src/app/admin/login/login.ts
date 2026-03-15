import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styles: [],
})
export class AdminLogin {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    if (auth.isLoggedIn()) router.navigate(['/admin/dashboard']);
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Identifiants incorrects';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
