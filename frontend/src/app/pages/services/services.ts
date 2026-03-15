import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ApiService, Service } from '../../services/api.service';

@Component({
  selector: 'app-services',
  imports: [RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
  services: Service[] = [];

  constructor(
    private title: Title,
    private meta: Meta,
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.title.setTitle('Services Municipaux - FIBEM | Mairie de Mbaling');
    this.meta.updateTag({
      name: 'description',
      content:
        'Etat civil, urbanisme, education, culture, sport, environnement : decouvrez tous les services proposes par la mairie de Mbaling.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Services Municipaux - Mairie de Mbaling',
    });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Tous les services de la mairie de Mbaling, Senegal.',
    });
    this.meta.updateTag({ property: 'og:url', content: 'https://www.mairie-mbaling.sn/services' });

    this.api.getServices().subscribe({
      next: (data) => { this.services = data; },
    });
  }
}
