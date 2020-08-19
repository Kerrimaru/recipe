import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesSub: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.dataStorageService.fetchRecipes().subscribe();
    this.recipes = this.recipeService.getRecipes();
    this.recipesSub = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      let recipeEdited = false;
      if (this.recipes.length === recipes.length) {
        recipeEdited = true;
      }
      this.recipes = recipes;
      if (!recipeEdited) {
        const index = recipes.length - 1;
        this.router.navigate([index], { relativeTo: this.route });
      }
    });
  }

  ngOnDestroy() {
    this.recipesSub.unsubscribe();
  }

  addNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}

// https://kerr-recipe.firebaseio.com/
