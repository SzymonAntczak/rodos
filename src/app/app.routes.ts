import { loadRemoteModule } from '@angular-architects/module-federation';
import type { Routes } from '@angular/router';
import { ContainerComponent } from './components/container/container.component';

export const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
  },
  {
    path: 'canvas',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './Component',
      }).then((m) => m.AppComponent),
  },
];
