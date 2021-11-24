import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RecipesComponent } from "./recipes.component";
// import { AuthGuard } from '../auth/auth.guard';
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipesResolverService } from "./recipes-resolver.service";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
// import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { canActivate } from "@angular/fire/compat/auth-guard";
import { map } from "rxjs/operators";
// import { User } from '../auth/user.model';
import { RecipeListComponent } from "./recipe-list/recipe-list.component";

const redirectLoggedInToRecipes = () =>
  map((user) => {
    return !user ? ["recipes"] : true;
  });

const routes: Routes = [
  {
    path: "",
    component: RecipesComponent,
    // canActivate: [AuthGuard],
    // canActivate: [AngularFireAuthGuard],
    resolve: { recipes: RecipesResolverService },
    ...canActivate(redirectLoggedInToRecipes),
    children: [
      { path: "", component: RecipeListComponent },
      { path: "new", component: RecipeEditComponent },
      {
        path: "to-do",
        component: RecipeListComponent,
      },
      {
        path: "favourites",
        component: RecipeListComponent,
      },
      { path: ":id", component: RecipeDetailComponent },
      { path: ":id/edit", component: RecipeEditComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
