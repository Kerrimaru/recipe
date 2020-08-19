import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
// import { ShoppingListComponent } from './shopping-list/shopping-list.component';
// import { RecipesComponent } from './recipes/recipes.component';
// import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
// import { EmptyRecipeComponent } from './recipes/empty-recipe/empty-recipe.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
// import { RecipesResolverService } from './recipes/recipes-resolver.service';
// import { AuthComponent } from './auth/auth.component';
// import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' }, <= older syntax
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then((module) => module.RecipesModule) },
  // {
  //   path: 'recipes',
  //   component: RecipesComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     { path: '', component: EmptyRecipeComponent },
  //     // { path: 'new', component: RecipeEditComponent },
  //     { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
  //     { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] },
  //   ],
  // },
  { path: 'new', component: RecipeEditComponent },
  {
    path: 'shopping-list',
    loadChildren: () => import('./shopping-list/shopping-list.module').then((module) => module.ShoppingListModule),
  },
  // { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then((module) => module.AuthModule) },
  // { path: 'login', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
