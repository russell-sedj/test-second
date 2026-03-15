import { Routes } from '@angular/router';
import { Actualites } from './pages/actualites/actualites';
import { Contact } from './pages/contact/contact';
import { Home } from './pages/home/home';
import { Mairie } from './pages/mairie/mairie';
import { Services } from './pages/services/services';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'mairie', component: Mairie },
  { path: 'services', component: Services },
  { path: 'actualites', component: Actualites },
  { path: 'contact', component: Contact },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: '**', redirectTo: '' },
];
