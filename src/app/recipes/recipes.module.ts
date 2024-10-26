import { NgModule } from '@angular/core';

import { RecipesComponent } from './recipes.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesRoutingModule } from './recipes-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
// import { MatLegacySliderModule as MatSliderModule } from "@angular/material/legacy-slider";
// import { TagSelectorComponent } from '../tags/tag-selector/tag-selector.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NutritionTableComponent } from './nutrition-table/nutrition-table.component';
import { NotesComponent } from './notes/notes.component';
import { DateComponent } from './date/date.component';
import { NoteComponent } from './note/note.component';
import { MatSliderModule } from '@angular/material/slider';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,

    RecipeEditComponent,

    NutritionTableComponent,

    NotesComponent,

    DateComponent,
    NoteComponent,
    // TagSelectorComponent,
  ],
  imports: [
    RecipesRoutingModule,
    SharedModule,
    DragDropModule,
    MatSliderModule,
    CKEditorModule,
    CommonModule,
  ],
  exports: [],
})
export class RecipesModule {}
