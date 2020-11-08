import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ShoppingListService } from 'src/app/shopping-list/shipping-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';
import { UserSettingsService } from 'src/app/settings/user-settings.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit, OnChanges {
  recipe: Recipe;
  recipeId: number;
  loading = false;
  recipes: any;
  recSub: any;
  user: any;
  userSub: any;
  showActions = false;
  isFavourite: boolean;

  constructor(
    private shoppingService: ShoppingListService,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private settingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user.getValue();
    console.log('init');
    // window.scrollTo({ top: 0, behavior: 'smooth' });

    // this.recipes = this.route.snapshot.data.recipes;
    // console.log('REIPCE DETAILS INIT', 'route? ', this.route);

    this.route.params.subscribe((params) => {
      this.recipeId = +params['id'];
      this.recSub = this.recipeService.getRecipeSub(this.recipeId).subscribe((r) => {
        this.recipe = r;
        this.isFavourite = this.settingsService.favourites.includes(r.key);
        this.showActions = !environment.production || this.recipe.userId === this.user.userId;
      });
      if (!this.recipe) {
        this.loading = true;
      }

      // console.log('this rec: ', this.recipe);
    });
  }

  favourite() {
    //  to do: move to user settings
    this.settingsService.toggleFavourite(this.recipe.key, true);
    // this.recipeService.toggleFavourite(this.recipe.key, this.recipe.favourite);
    // this.recipe.favourite = !this.recipe.favourite;
  }

  ngOnChanges(change: SimpleChanges) {
    // console.log('changes: ', change);
    // this.recipe = change[this.recipeId];
  }

  // addToShoppingList() {
  //   this.shoppingService.addIngredients(this.recipe.ingredients);
  // }

  editRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteRecipe() {
    this.recipeService.deleteRecipe(this.recipeId);
  }
}
