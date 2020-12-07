import { NgModule, ModuleWithProviders } from '@angular/core';
import { LoadingComponent } from './loading/loading.component';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { TitlePipe } from './pipes/title.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RecipeFilterPipe } from './pipes/recipe-filter.pipe';
import { ArrayIncludesPipe } from './pipes/array-includes.pipe';
import { ShowOnScrollDirective } from './directives/show-on-scroll.directive';
import { FavouritesPipe } from './pipes/favourites.pipe';

@NgModule({
  declarations: [
    LoadingComponent,
    DropdownDirective,
    TitlePipe,
    RecipeFilterPipe,
    ArrayIncludesPipe,
    ShowOnScrollDirective,
    FavouritesPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [
    LoadingComponent,
    DropdownDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    TitlePipe,
    RecipeFilterPipe,
    ArrayIncludesPipe,
    ShowOnScrollDirective,
    FavouritesPipe,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [TitlePipe, RecipeFilterPipe, ArrayIncludesPipe, FavouritesPipe],
    };
  }
}
