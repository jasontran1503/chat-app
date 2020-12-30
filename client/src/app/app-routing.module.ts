import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/guards/auth.guard';
import { HeaderComponent } from './common/layouts/header/header.component';
import { LayoutsModule } from './common/layouts/layouts.module';
import { PageNotFoundComponent } from './common/layouts/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
      {
        path: 'user',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./core/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'chat',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./core/chat/chat.module').then((m) => m.ChatModule),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: '404',
    component: PageNotFoundComponent,
  },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [LayoutsModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
