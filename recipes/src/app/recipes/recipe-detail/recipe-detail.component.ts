import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ShoppingListService } from 'src/app/shopping-list/shipping-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

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

  constructor(
    private shoppingService: ShoppingListService,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.recipes = this.route.snapshot.data.recipes;
    console.log('route? ', this.route);
    console.log('REIPCE DETAILS');
    this.route.params.subscribe((params) => {
      this.recipeId = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.recipeId);
      if (!this.recipe) {
        this.loading = true;
      }

      console.log('this rec: ', this.recipe);
    });
  }

  ngOnChanges(change: SimpleChanges) {
    console.log('changes: ', change);
    // this.recipe = change[this.recipeId];
  }

  addToShoppingList() {
    this.shoppingService.addIngredients(this.recipe.ingredients);
  }

  editRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteRecipe() {
    this.recipeService.deleteRecipe(this.recipeId);
  }
}
