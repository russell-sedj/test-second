import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

interface Actualite {
  id: number;
  titre: string;
  date: string;
  resume: string;
  categorie: string;
  badgeClass: string;
  bgClass: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  ngOnInit() {
    this.title.setTitle('Mairie de Mbaling (FIBEM) - Site Officiel');
    this.meta.updateTag({
      name: 'description',
      content:
        'Site officiel de la Mairie de Mbaling - FIBEM, Sénégal. Découvrez les services municipaux, les actualités et les démarches administratives de votre commune.',
    });
    this.meta.updateTag({ name: 'keywords', content: 'FIBEM, Mairie de Mbaling, Mbaling, commune, Sénégal, services municipaux, actualités, FIBEM Sénégal' });
    this.meta.updateTag({ property: 'og:title', content: 'Mairie de Mbaling - Site Officiel' });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Site officiel de la mairie de Mbaling, Sénégal.',
    });
    this.meta.updateTag({ property: 'og:url', content: 'https://www.mairie-mbaling.sn/' });
  }
  actualites: Actualite[] = [
    {
      id: 1,
      titre: 'Rénovation de la place centrale - Phase 2 lancée',
      date: '5 mars 2026',
      resume:
        "Les travaux de rénovation de la place centrale entrent dans leur deuxième phase avec la création d'espaces verts et de zones piétonnes modernes.",
      categorie: 'Travaux',
      badgeClass: 'bg-orange-100 text-orange-700',
      bgClass: 'bg-gradient-to-br from-orange-400 to-orange-600',
    },
    {
      id: 2,
      titre: 'Inscriptions scolaires 2026-2027 ouvertes',
      date: '28 février 2026',
      resume:
        "Les inscriptions pour l'année scolaire 2026-2027 sont désormais ouvertes. Rendez-vous en mairie ou sur notre portail en ligne.",
      categorie: 'Éducation',
      badgeClass: 'bg-green-100 text-green-700',
      bgClass: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    {
      id: 3,
      titre: 'Fête de printemps - 20 & 21 avril 2026',
      date: '15 février 2026',
      resume:
        'La traditionnelle fête de printemps aura lieu les 20 et 21 avril. Concerts, animations et expositions pour toute la famille.',
      categorie: 'Événement',
      badgeClass: 'bg-purple-100 text-purple-700',
      bgClass: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
  ];

  services = [
    {
      titre: 'État civil',
      description: "Naissance, mariage, décès, copies d'actes et livret de famille.",
      bgIcon: 'bg-blue-100',
      iconColor: 'text-blue-700',
    },
    {
      titre: 'Urbanisme',
      description: "Permis de construire, déclarations de travaux et plan local d'urbanisme.",
      bgIcon: 'bg-amber-100',
      iconColor: 'text-amber-700',
    },
    {
      titre: 'Éducation',
      description: 'Inscriptions scolaires, cantine, garderie et activités périscolaires.',
      bgIcon: 'bg-green-100',
      iconColor: 'text-green-700',
    },
    {
      titre: 'Culture',
      description: 'Médiathèque, associations culturelles, expositions et événements locaux.',
      bgIcon: 'bg-purple-100',
      iconColor: 'text-purple-700',
    },
    {
      titre: 'Sport',
      description: 'Installations sportives, associations et calendrier des activités.',
      bgIcon: 'bg-red-100',
      iconColor: 'text-red-700',
    },
    {
      titre: 'Environnement',
      description: 'Espaces verts, collecte des déchets et développement durable.',
      bgIcon: 'bg-teal-100',
      iconColor: 'text-teal-700',
    },
  ];

  stats = [
    { value: '12 500', label: 'Habitants' },
    { value: '6', label: 'Services municipaux' },
    { value: '35', label: 'Associations locales' },
    { value: '4', label: 'Écoles publiques' },
  ];
}
