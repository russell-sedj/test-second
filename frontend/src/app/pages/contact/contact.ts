import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  form: FormGroup;
  submitted = false;
  success = false;
  sending = false;
  apiError = '';

  sujets = [
    'État civil',
    'Urbanisme / Travaux',
    'Éducation',
    'Culture & Sport',
    'Environnement',
    'Signalement / Voirie',
    'Autre demande',
  ];

  constructor(
    private fb: FormBuilder,
    private title: Title,
    private meta: Meta,
    private api: ApiService,
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      sujet: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  ngOnInit() {
    this.title.setTitle('Nous contacter - FIBEM | Mairie de Mbaling');
    this.meta.updateTag({
      name: 'description',
      content:
        'Contactez la mairie de Mbaling\u202f: formulaire en ligne, adresse, t\u00e9l\u00e9phone et horaires d\u2019ouverture.',
    });
    this.meta.updateTag({ property: 'og:title', content: 'Nous contacter - Mairie de Mbaling' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Formulaire de contact et coordonn\u00e9es de la mairie de Mbaling, S\u00e9n\u00e9gal.',
    });
    this.meta.updateTag({ property: 'og:url', content: 'https://www.mairie-mbaling.sn/contact' });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.apiError = '';
    if (this.form.invalid) return;
    this.sending = true;
    const { nom, email, sujet, message } = this.form.value;
    this.api.sendContact({ nom, email, sujet, message }).subscribe({
      next: () => {
        this.success = true;
        this.sending = false;
        this.form.reset();
        this.submitted = false;
      },
      error: (err) => {
        this.apiError = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        this.sending = false;
      },
    });
  }
}
