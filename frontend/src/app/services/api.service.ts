import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { AuthService } from '../admin/auth.service';

export interface Actualite {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  date: string;
  badgeClass: string;
  bgClass: string;
}

export interface ActualiteRaw {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  date: string;
  badge_class: string;
  bg_class: string;
  created_at: string;
}

export interface DocumentApi {
  id: number;
  nom: string;
  description: string;
  categorie: string;
  filename: string;
  size: number;
  created_at: string;
}

export interface Conseiller {
  id: number;
  nom: string;
  role: string;
  responsabilite: string;
  ordre: number;
}

export interface Service {
  id: number;
  titre: string;
  description: string;
  details: string[];
  bgIcon: string;
  iconColor: string;
  borderColor: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  private get authHeaders() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  // -- Contact --
  sendContact(data: { nom: string; email: string; sujet: string; message: string }) {
    return this.http.post<{ message: string }>(`${this.base}/contact`, data);
  }

  // -- Actualites (public - camelCase pour les templates) --
  getActualites() {
    return this.http.get<ActualiteRaw[]>(`${this.base}/actualites`).pipe(
      map((rows) =>
        rows.map((r) => ({
          id: r.id,
          titre: r.titre,
          description: r.description,
          categorie: r.categorie,
          date: r.date,
          badgeClass: r.badge_class,
          bgClass: r.bg_class,
        })),
      ),
    );
  }

  // -- Actualites (admin - snake_case brut) --
  getActualitesRaw() {
    return this.http.get<ActualiteRaw[]>(`${this.base}/actualites`);
  }

  createActualite(data: Partial<ActualiteRaw>) {
    return this.http.post<ActualiteRaw>(`${this.base}/actualites`, data, {
      headers: this.authHeaders,
    });
  }

  updateActualite(id: number, data: Partial<ActualiteRaw>) {
    return this.http.put<ActualiteRaw>(`${this.base}/actualites/${id}`, data, {
      headers: this.authHeaders,
    });
  }

  deleteActualite(id: number) {
    return this.http.delete(`${this.base}/actualites/${id}`, {
      headers: this.authHeaders,
    });
  }

  // -- Documents (public - telechargement seulement) --
  documentDownloadUrl(id: number) {
    return `${this.base}/documents/${id}/download`;
  }

  // -- Conseillers --
  getConseillers() {
    return this.http.get<Conseiller[]>(`${this.base}/conseillers`);
  }

  createConseiller(data: Partial<Conseiller>) {
    return this.http.post<Conseiller>(`${this.base}/conseillers`, data, {
      headers: this.authHeaders,
    });
  }

  updateConseiller(id: number, data: Partial<Conseiller>) {
    return this.http.put<Conseiller>(`${this.base}/conseillers/${id}`, data, {
      headers: this.authHeaders,
    });
  }

  deleteConseiller(id: number) {
    return this.http.delete(`${this.base}/conseillers/${id}`, {
      headers: this.authHeaders,
    });
  }

  // -- Services --
  getServices() {
    return this.http.get<Service[]>(`${this.base}/services`);
  }

  createService(data: Partial<Service>) {
    return this.http.post<Service>(`${this.base}/services`, data, {
      headers: this.authHeaders,
    });
  }

  updateService(id: number, data: Partial<Service>) {
    return this.http.put<Service>(`${this.base}/services/${id}`, data, {
      headers: this.authHeaders,
    });
  }

  deleteService(id: number) {
    return this.http.delete(`${this.base}/services/${id}`, {
      headers: this.authHeaders,
    });
  }
}