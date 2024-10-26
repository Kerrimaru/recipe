import { NgModule, ModuleWithProviders } from '@angular/core';
import { LoadingComponent } from './components/loading/loading.component';
// import { CommonModule } from "@angular/common";
// import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
// import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
// import { MatLegacySlideToggleModule as MatSlideToggleModule } from "@angular/material/legacy-slide-toggle";
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
// import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
// import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";
import { MatExpansionModule } from '@angular/material/expansion';
// import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";

import { RecipeFilterPipe } from './pipes/recipe-filter.pipe';
import { ArrayIncludesPipe } from './pipes/array-includes.pipe';
import { FavouritesPipe } from './pipes/favourites.pipe';
import { TitlePipe } from './pipes/title.pipe';

import { ShowOnScrollDirective } from './directives/show-on-scroll.directive';
import { LottieDirective } from './directives/lottie.directive';
import { DropdownDirective } from './dropdown.directive';
// import { AlertComponent } from "./dialog/alert/alert.component";
// import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { AuthDialogComponent } from './dialog/auth-dialog/auth-dialog.component';
import { LongpressDirective } from './directives/longpress.directive';
import { TagComponent } from './components/tag/tag.component';
import { RecentPipe } from './pipes/recent.pipe';
import { MinMaxPipe } from './pipes/min-max.pipe';
import { DateListComponent } from './components/date-list/date-list.component';
import { MonthPipe } from './pipes/month.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
// import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    LoadingComponent,
    // AlertComponent,
    AuthDialogComponent,
    TagComponent,
    DateListComponent,

    TitlePipe,
    RecipeFilterPipe,
    ArrayIncludesPipe,
    RecentPipe,
    FavouritesPipe,
    MinMaxPipe,

    DropdownDirective,
    ShowOnScrollDirective,
    LottieDirective,
    LongpressDirective,
    MonthPipe,
    ReversePipe,
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
    TagComponent,
    DateListComponent,

    DropdownDirective,
    ShowOnScrollDirective,
    LongpressDirective,
    LottieDirective,

    TitlePipe,
    RecipeFilterPipe,
    ArrayIncludesPipe,
    FavouritesPipe,
    RecentPipe,
    MinMaxPipe,
    MonthPipe,
    ReversePipe,

    // CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatInputModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        TitlePipe,
        RecipeFilterPipe,
        ArrayIncludesPipe,
        FavouritesPipe,
        RecentPipe,
        MinMaxPipe,
      ],
    };
  }
}
