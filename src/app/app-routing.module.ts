import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToRecipes = () => redirectLoggedInTo(['recipes']);

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' }, <= older syntax
  {
    path: 'recipes',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('./recipes/recipes.module').then((module) => module.RecipesModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then((module) => module.SettingsModule),
  },
  {
    path: 'login',
    ...canActivate(redirectLoggedInToRecipes),
    loadChildren: () => import('./auth/auth.module').then((module) => module.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
