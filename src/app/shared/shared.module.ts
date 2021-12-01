import { NgModule, ModuleWithProviders } from "@angular/core";
import { LoadingComponent } from "./components/loading/loading.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { RecipeFilterPipe } from "./pipes/recipe-filter.pipe";
import { ArrayIncludesPipe } from "./pipes/array-includes.pipe";
import { FavouritesPipe } from "./pipes/favourites.pipe";
import { TitlePipe } from "./pipes/title.pipe";

import { ShowOnScrollDirective } from "./directives/show-on-scroll.directive";
import { LottieDirective } from "./directives/lottie.directive";
import { DropdownDirective } from "./dropdown.directive";
import { AlertComponent } from "./dialog/alert/alert.component";
import { MatDialogModule } from "@angular/material/dialog";
import { AuthDialogComponent } from "./dialog/auth-dialog/auth-dialog.component";
import { LongpressDirective } from "./directives/longpress.directive";
import { TagComponent } from "./components/tag/tag.component";

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
    LongpressDirective,
    AlertComponent,
    AuthDialogComponent,
    TagComponent,
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

    DropdownDirective,
    ShowOnScrollDirective,
    LongpressDirective,
    LottieDirective,

    TitlePipe,
    RecipeFilterPipe,
    ArrayIncludesPipe,
    FavouritesPipe,

    CommonModule,
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
      ],
    };
  }
}
