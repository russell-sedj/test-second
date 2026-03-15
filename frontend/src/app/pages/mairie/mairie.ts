import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ApiService, Conseiller } from '../../services/api.service';

@Component({
  selector: 'app-mairie',
  imports: [RouterLink],
  templateUrl: './mairie.html',
  styleUrl: './mairie.css',
})
export class Mairie implements OnInit {
  conseillers: Conseiller[] = [];

  get maire(): Conseiller | undefined {
    return this.conseillers.find((c) => c.role.toLowerCase() === 'maire') ?? this.conseillers[0];
  }

  chiffres = [
    { value: '12 500', label: 'Habitants' },
    { value: '38 km²', label: 'Superficie' },
    { value: '1969', label: 'Année de création' },
    { value: '35', label: 'Associations' },
  ];

  constructor(
    private title: Title,
    private meta: Meta,
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.title.setTitle('La Mairie - FIBEM | Mairie de Mbaling');
    this.meta.updateTag({
      name: 'description',
      content:
        "Découvrez la mairie de Mbaling : le conseil municipal, l'histoire et les chiffres clés de la commune.",
    });
    this.meta.updateTag({ property: 'og:title', content: 'La Mairie - Mairie de Mbaling' });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Conseil municipal, histoire et missions de la mairie de Mbaling, Sénégal.',
    });
    this.meta.updateTag({ property: 'og:url', content: 'https://www.mairie-mbaling.sn/mairie' });

    this.api.getConseillers().subscribe({
      next: (data) => { this.conseillers = data; },
    });
  }
}
