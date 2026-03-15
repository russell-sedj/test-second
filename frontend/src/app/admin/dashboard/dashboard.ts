import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ApiService, ActualiteRaw, Conseiller, Service } from '../../services/api.service';

const CATEGORY_STYLES: Record<string, { badge: string; bg: string }> = {
  'Travaux':      { badge: 'bg-orange-100 text-orange-700', bg: 'bg-gradient-to-br from-orange-400 to-orange-600' },
  'Education':    { badge: 'bg-green-100 text-green-700',   bg: 'bg-gradient-to-br from-green-400 to-green-600' },
  'Evenement':    { badge: 'bg-purple-100 text-purple-700', bg: 'bg-gradient-to-br from-purple-400 to-purple-600' },
  'Institution':  { badge: 'bg-blue-100 text-blue-700',     bg: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  'Environnement':{ badge: 'bg-teal-100 text-teal-700',     bg: 'bg-gradient-to-br from-teal-400 to-teal-600' },
  'Autre':        { badge: 'bg-gray-100 text-gray-700',     bg: 'bg-gradient-to-br from-gray-400 to-gray-600' },
};

const SERVICE_THEMES: Record<string, { bgIcon: string; iconColor: string; borderColor: string }> = {
  'Bleu':   { bgIcon: 'bg-blue-100',   iconColor: 'text-blue-700',   borderColor: 'border-blue-200' },
  'Vert':   { bgIcon: 'bg-green-100',  iconColor: 'text-green-700',  borderColor: 'border-green-200' },
  'Orange': { bgIcon: 'bg-amber-100',  iconColor: 'text-amber-700',  borderColor: 'border-amber-200' },
  'Violet': { bgIcon: 'bg-purple-100', iconColor: 'text-purple-700', borderColor: 'border-purple-200' },
  'Teal':   { bgIcon: 'bg-teal-100',   iconColor: 'text-teal-700',   borderColor: 'border-teal-200' },
  'Rouge':  { bgIcon: 'bg-red-100',    iconColor: 'text-red-700',    borderColor: 'border-red-200' },
};

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styles: [],
})
export class AdminDashboard implements OnInit {
  activeTab: 'actualites' | 'conseillers' | 'services' = 'actualites';
  categories = Object.keys(CATEGORY_STYLES);
  serviceThemes = Object.keys(SERVICE_THEMES);

  actualites: ActualiteRaw[] = [];
  showActuForm = false;
  editingActu: ActualiteRaw | null = null;
  actuForm = { titre: '', description: '', categorie: 'Travaux', date: '' };
  actuLoading = false;
  actuError = '';

  conseillers: Conseiller[] = [];
  showConseForm = false;
  editingConse: Conseiller | null = null;
  conseForm = { nom: '', role: '', responsabilite: '', ordre: 1 };
  conseLoading = false;
  conseError = '';

  services: Service[] = [];
  showServForm = false;
  editingServ: Service | null = null;
  servForm = { titre: '', description: '', detailsText: '', theme: 'Bleu' };
  servLoading = false;
  servError = '';

  globalError = '';

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadActualites();
    this.loadConseillers();
    this.loadServices();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  loadActualites() {
    this.api.getActualitesRaw().subscribe({
      next: (data) => { this.actualites = data; this.cdr.detectChanges(); },
      error: () => { this.globalError = 'Impossible de charger les actualites'; this.cdr.detectChanges(); },
    });
  }

  openCreateActu() {
    this.editingActu = null;
    const today = new Date().toLocaleDateString('fr-SN', { day: 'numeric', month: 'long', year: 'numeric' });
    this.actuForm = { titre: '', description: '', categorie: 'Travaux', date: today };
    this.actuError = '';
    this.showActuForm = true;
  }

  openEditActu(item: ActualiteRaw) {
    this.editingActu = item;
    this.actuForm = { titre: item.titre, description: item.description, categorie: item.categorie, date: item.date };
    this.actuError = '';
    this.showActuForm = true;
  }

  saveActu() {
    if (!this.actuForm.titre || !this.actuForm.description || !this.actuForm.date) {
      this.actuError = 'Titre, description et date sont obligatoires';
      return;
    }
    this.actuLoading = true;
    this.actuError = '';
    const styles = CATEGORY_STYLES[this.actuForm.categorie] || CATEGORY_STYLES['Autre'];
    const payload = { ...this.actuForm, badge_class: styles.badge, bg_class: styles.bg };
    const obs = this.editingActu
      ? this.api.updateActualite(this.editingActu.id, payload)
      : this.api.createActualite(payload);
    obs.subscribe({
      next: () => { this.actuLoading = false; this.showActuForm = false; this.cdr.detectChanges(); this.loadActualites(); },
      error: (err: any) => { this.actuError = err.error?.message || 'Erreur lors de la sauvegarde'; this.actuLoading = false; this.cdr.detectChanges(); },
    });
  }

  deleteActu(id: number) {
    if (!confirm('Supprimer cette actualite ?')) return;
    this.api.deleteActualite(id).subscribe({
      next: () => this.loadActualites(),
      error: () => { this.globalError = 'Erreur lors de la suppression'; this.cdr.detectChanges(); },
    });
  }

  loadConseillers() {
    this.api.getConseillers().subscribe({
      next: (data) => { this.conseillers = data; this.cdr.detectChanges(); },
      error: () => { this.globalError = 'Impossible de charger les conseillers'; this.cdr.detectChanges(); },
    });
  }

  openCreateConse() {
    this.editingConse = null;
    this.conseForm = { nom: '', role: '', responsabilite: '', ordre: this.conseillers.length + 1 };
    this.conseError = '';
    this.showConseForm = true;
  }

  openEditConse(item: Conseiller) {
    this.editingConse = item;
    this.conseForm = { nom: item.nom, role: item.role, responsabilite: item.responsabilite, ordre: item.ordre };
    this.conseError = '';
    this.showConseForm = true;
  }

  saveConse() {
    if (!this.conseForm.nom || !this.conseForm.role) {
      this.conseError = 'Nom et role sont obligatoires';
      return;
    }
    this.conseLoading = true;
    this.conseError = '';
    const obs = this.editingConse
      ? this.api.updateConseiller(this.editingConse.id, this.conseForm)
      : this.api.createConseiller(this.conseForm);
    obs.subscribe({
      next: () => { this.conseLoading = false; this.showConseForm = false; this.cdr.detectChanges(); this.loadConseillers(); },
      error: (err: any) => { this.conseError = err.error?.message || 'Erreur lors de la sauvegarde'; this.conseLoading = false; this.cdr.detectChanges(); },
    });
  }

  deleteConse(id: number) {
    if (!confirm('Supprimer ce conseiller ?')) return;
    this.api.deleteConseiller(id).subscribe({
      next: () => this.loadConseillers(),
      error: () => { this.globalError = 'Erreur lors de la suppression'; this.cdr.detectChanges(); },
    });
  }

  loadServices() {
    this.api.getServices().subscribe({
      next: (data) => { this.services = data; this.cdr.detectChanges(); },
      error: () => { this.globalError = 'Impossible de charger les services'; this.cdr.detectChanges(); },
    });
  }

  openCreateServ() {
    this.editingServ = null;
    this.servForm = { titre: '', description: '', detailsText: '', theme: 'Bleu' };
    this.servError = '';
    this.showServForm = true;
  }

  openEditServ(item: Service) {
    this.editingServ = item;
    const theme = Object.entries(SERVICE_THEMES).find(([, v]) => v.bgIcon === item.bgIcon)?.[0] || 'Bleu';
    this.servForm = { titre: item.titre, description: item.description, detailsText: item.details.join('\n'), theme };
    this.servError = '';
    this.showServForm = true;
  }

  saveServ() {
    if (!this.servForm.titre || !this.servForm.description) {
      this.servError = 'Titre et description sont obligatoires';
      return;
    }
    this.servLoading = true;
    this.servError = '';
    const t = SERVICE_THEMES[this.servForm.theme] || SERVICE_THEMES['Bleu'];
    const details = this.servForm.detailsText.split('\n').map((d: string) => d.trim()).filter(Boolean);
    const payload = { titre: this.servForm.titre, description: this.servForm.description, details, ...t };
    const obs = this.editingServ
      ? this.api.updateService(this.editingServ.id, payload)
      : this.api.createService(payload);
    obs.subscribe({
      next: () => { this.servLoading = false; this.showServForm = false; this.cdr.detectChanges(); this.loadServices(); },
      error: (err: any) => { this.servError = err.error?.message || 'Erreur lors de la sauvegarde'; this.servLoading = false; this.cdr.detectChanges(); },
    });
  }

  deleteServ(id: number) {
    if (!confirm('Supprimer ce service ?')) return;
    this.api.deleteService(id).subscribe({
      next: () => this.loadServices(),
      error: () => { this.globalError = 'Erreur lors de la suppression'; this.cdr.detectChanges(); },
    });
  }
}
