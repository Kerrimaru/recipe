import { NgModule, ModuleWithProviders } from '@angular/core';
import { LoadingComponent } from './loading/loading.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RecipeFilterPipe } from './pipes/recipe-filter.pipe';
import { ArrayIncludesPipe } from './pipes/array-includes.pipe';
import { FavouritesPipe } from './pipes/favourites.pipe';
import { TitlePipe } from './pipes/title.pipe';

import { ShowOnScrollDirective } from './directives/show-on-scroll.directive';
import { LottieDirective } from './directives/lottie.directive';
import { DropdownDirective } from './dropdown.directive';
import { AlertComponent } from './dialog/alert/alert.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthDialogComponent } from './dialog/auth-dialog/auth-dialog.component';

@NgModule({
  declarations: [
    LoadingComponent,
    DropdownDirective,
    TitlePipe,
    RecipeFilterPipe,
    ArrayIncludesPipe,
    ShowOnScrollDirective,
    FavouritesPipe,
    LottieDirective,
    AlertComponent,
    AuthDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatDialogModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatInputModule,
    LottieDirective,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatDialogModule,
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
