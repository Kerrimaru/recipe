import { NgModule } from '@angular/core';

import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { EmptyRecipeComponent } from './empty-recipe/empty-recipe.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesRoutingModule } from './recipes-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { MatSliderModule } from '@angular/material/slider';
import { TagSelectorComponent } from '../tags/tag-selector/tag-selector.component';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    EmptyRecipeComponent,
    RecipeEditComponent,
    TagSelectorComponent,
  ],
  imports: [
    RecipesRoutingModule,
    SharedModule,
    DragDropModule,
    // ReactiveFormsModule
    MatSliderModule,
  ],
  exports: [
    //   RecipesComponent,
    //   RecipeListComponent,
    //   RecipeDetailComponent,
    //   RecipeItemComponent,
    //   EmptyRecipeComponent,
    //   RecipeEditComponent,
  ],
})
export class RecipesModule {}
