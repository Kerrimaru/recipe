import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { environment } from '../environments/environment';
// import { RecipesComponent } from './recipes/recipes.component';
// import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
// import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
// import { EmptyRecipeComponent } from './recipes/empty-recipe/empty-recipe.component';
// import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
// import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
// import { ShoppingListComponent } from './shopping-list/shopping-list.component';
// import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
// import { LoadingComponent } from './shared/loading/loading.component';
// import { DropdownDirective } from './shared/dropdown.directive';
// import { ShoppingListService } from './shopping-list/shipping-list.service';
import { AppRoutingModule } from './app-routing.module';
// import { RecipeService } from './recipes/recipe.service';
// import { AuthComponent } from './auth/auth.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AuthInterceptorService } from './auth/auth.interceptor.service';
// import { RecipesModule } from './recipes/recipes.module';
// import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { AngularFireDatabaseModule } from '@angular/fire/database';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireStorageModule } from '@angular/fire/storage';
// import { AngularFireAuthModule } from '@angular/fire/auth';

// import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    // AuthComponent,
    // RecipesComponent,
    // RecipeListComponent,
    // RecipeDetailComponent,
    // RecipeItemComponent,
    // EmptyRecipeComponent,
    // RecipeEditComponent,
    // ShoppingListComponent,
    // ShoppingEditComponent,
    // DropdownDirective,
    // LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'kerr-recipe'),
    AngularFireDatabaseModule,
    // FormsModule,
    AppRoutingModule,
    // ReactiveFormsModule,
    HttpClientModule,
    // RecipesModule, // is lazy load
    // ShoppingListModule, // is lazy load
    SharedModule,
    CoreModule,
    DragDropModule,
    BrowserAnimationsModule,
    // AuthModule, // is lazy load

    // AngularFirestoreModule, // firestore
    // AngularFireAuthModule, // auth
    // AngularFireStorageModule, // storage
  ],
  providers: [
    // ShoppingListService,
    // RecipeService,
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
