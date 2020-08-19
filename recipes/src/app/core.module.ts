import { NgModule } from '@angular/core';
import { ShoppingListService } from './shopping-list/shipping-list.service';
import { RecipeService } from './recipes/recipe.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth.interceptor.service';

@NgModule({
  providers: [
    // services here are provided for demo only, but a better approach is to add
    // => @Injectable({ providedIn: 'root' }) into the class, as we did with AuthService, DataStorageService, etc
    ShoppingListService,
    RecipeService,
    // for interceptors however, this is an ok approach, but could also have just been added directly to the AppModule
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  ],
})
export class CoreModule {}
