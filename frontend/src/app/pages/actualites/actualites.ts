import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';

interface Actualite {
  id: number;
  titre: string;
  date: string;
  description: string;
  categorie: string;
  badgeClass: string;
  bgClass: string;
}

@Component({
  selector: 'app-actualites',
  imports: [RouterLink, FormsModule],
  templateUrl: './actualites.html',
  styleUrl: './actualites.css',
})
export class Actualites implements OnInit {
  private platformId = inject(PLATFORM_ID);
  categories = ['Toutes', 'Travaux', 'Éducation', 'Événement', 'Institution', 'Environnement'];
  selectedCategorie = 'Toutes';
  searchQuery = '';

  constructor(
    private title: Title,
    private meta: Meta,
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.title.setTitle('Actualités - FIBEM | Mairie de Mbaling');
    this.meta.updateTag({
      name: 'description',
      content:
        'Toutes les actualités de la commune de Mbaling : travaux, événements, décisions municipales, environnement et éducation.',
    });
    this.meta.updateTag({ property: 'og:title', content: 'Actualités - Mairie de Mbaling' });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Actualités municipales de Mbaling, Sénégal.',
    });
    this.meta.updateTag({
      property: 'og:url',
      content: 'https://www.mairie-mbaling.sn/actualites',
    });

    if (isPlatformBrowser(this.platformId)) {
      this.api.getActualites().subscribe({
        next: (data) => (this.allActualites = data),
        error: () => {
          /* garde les données statiques */
        },
      });
    }
  }

  allActualites: Actualite[] = [
    {
      id: 1,
      titre: 'Rénovation de la place centrale - Phase 2 lancée',
      date: '5 mars 2026',
      description:
        "Les travaux de rénovation de la place centrale de Mbaling entrent dans leur deuxième phase avec la création d'espaces verts et de zones piétonnes modernes. Cette phase sera terminée d'ici septembre 2026.",
      categorie: 'Travaux',
      badgeClass: 'bg-orange-100 text-orange-700',
      bgClass: 'bg-gradient-to-br from-orange-400 to-orange-600',
    },
    {
      id: 2,
      titre: 'Inscriptions scolaires 2026-2027 ouvertes',
      date: '28 février 2026',
      description:
        "Les inscriptions pour l'année scolaire 2026-2027 sont désormais ouvertes. Rendez-vous en mairie muni des documents nécessaires ou inscrivez-vous en ligne sur notre portail.",
      categorie: 'Éducation',
      badgeClass: 'bg-green-100 text-green-700',
      bgClass: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    {
      id: 3,
      titre: 'Fête de printemps - 20 & 21 avril 2026',
      date: '15 février 2026',
      description:
        'La traditionnelle fête de printemps de Mbaling aura lieu les 20 et 21 avril 2026. Concerts, animations et expositions pour toute la famille sont au programme.',
      categorie: 'Événement',
      badgeClass: 'bg-purple-100 text-purple-700',
      bgClass: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
    {
      id: 4,
      titre: 'Conseil municipal du 10 mars 2026',
      date: '1 février 2026',
      description:
        'Le prochain conseil municipal se tiendra le 10 mars 2026 à 18h30 en mairie. Les citoyens sont invités à assister à cette séance publique.',
      categorie: 'Institution',
      badgeClass: 'bg-blue-100 text-blue-700',
      bgClass: 'bg-gradient-to-br from-blue-500 to-blue-700',
    },
    {
      id: 5,
      titre: 'Plantation de 200 arbres dans la commune',
      date: '20 janvier 2026',
      description:
        "Dans le cadre de son plan vert, la mairie de Mbaling plante 200 arbres sur l'ensemble du territoire communal ce mois-ci. Un geste fort pour l'environnement.",
      categorie: 'Environnement',
      badgeClass: 'bg-teal-100 text-teal-700',
      bgClass: 'bg-gradient-to-br from-teal-400 to-teal-600',
    },
    {
      id: 6,
      titre: 'Ouverture de la nouvelle médiathèque',
      date: '10 janvier 2026',
      description:
        'La nouvelle médiathèque municipale ouvrira ses portes le 1er avril 2026. Un espace moderne de 800 m² avec plus de 25 000 ouvrages, espace numérique et salle de conférence.',
      categorie: 'Événement',
      badgeClass: 'bg-purple-100 text-purple-700',
      bgClass: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    },
  ];

  get filteredActualites(): Actualite[] {
    let result = this.allActualites;
    if (this.selectedCategorie !== 'Toutes') {
      result = result.filter((a) => a.categorie === this.selectedCategorie);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (a) => a.titre.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
      );
    }
    return result;
  }

  selectCategorie(cat: string) {
    this.selectedCategorie = cat;
    this.searchQuery = '';
  }
}
