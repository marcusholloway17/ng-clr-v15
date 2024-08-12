import { Injector, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { SignInResultInterface } from './modules/login';
import { createAppRoutes } from './modules/helpers';
import { LINKS } from './routes';

/**
 * Function to create the path to dashboad interface
 */
export async function dashboardPathFn(
  injector: Injector,
  result: SignInResultInterface
) {
  return injector.get(Router).navigateByUrl(`/membership/employer/dashboard`);
  // TODO: Check for scopes requirements if required
  // TODO: show a ui alert for user cannot login
  // const message = await firstValueFrom(
  //   injector.get(COMMON_STRINGS).pipe(map((state) => state.authorizationError))
  // );

  // return injector.get(UI_STATE_CONTROLLER).endAction(message, 'success');
}

const routes: Routes = [
  // Default routes
  {
    path: '',
    redirectTo: environment.auth.redirect.url,
    pathMatch: 'full',
  },
  // login route
  {
    path: environment.auth.redirect.url,
    loadChildren: () =>
      import('./modules/login/ui/login-routing.module').then(
        (m) => m.LoginRoutingModule
      ),
    data: {
      path: dashboardPathFn,
      moduleName: environment.module.name,
      companyName: environment.module.company_name,
      companyDescription: environment.module.company_description,
      logoAssetPath: environment.module.logoAssetPath,
    },
  },

  // app main route
  ...createAppRoutes(LINKS),

  // Fallback route
  {
    path: '**',
    redirectTo: environment.auth.redirect.url,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
