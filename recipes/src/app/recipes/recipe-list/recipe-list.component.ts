import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
// import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { RecipesConst } from '../../../assets/seeds';
import { filter } from 'rxjs/operators';
import { UserSettingsService } from 'src/app/settings/user-settings.service';
// import { auth } from 'firebase/app';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesSub: Subscription;
  recipeList: Observable<any[]>;
  searchTerm: string;
  favouritesArr: any[];
  selectedRecipe: Recipe;
  searchOn = false;

  constructor(
    public fbAuth: AngularFireAuth,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private fb: AngularFireDatabase,
    // private fb: AngularFirestore
    private settingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.favouritesArr = this.router.url.valueOf() === '/recipes/favourites' ? this.settingsService.favourites : [];
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      this.favouritesArr = e.url === '/recipes/favourites' ? this.settingsService.favourites : null;
    });

    this.recipesSub = this.recipeService.recTest.subscribe((recipes) => {
      this.recipes = recipes;
      let recipeEdited = false;

      if (this.recipes.length === recipes.length) {
        recipeEdited = true;
      }
      if (!recipeEdited) {
        const index = recipes.length - 1;
        this.router.navigate([index], { relativeTo: this.route });
      }
    });
    // this.recipes = this.recipeService.getRecipes();
    // this.recipesSub = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
    //   console.log('recipes changed:', recipes);
    //   let recipeEdited = false;
    //   if (this.recipes.length === recipes.length) {
    //     recipeEdited = true;
    //   }
    //   this.recipes = recipes;
    //   if (!recipeEdited) {
    //     const index = recipes.length - 1;
    //     // this.router.navigate([index], { relativeTo: this.route });
    //   }
    // });
  }

  ngOnDestroy() {
    this.recipesSub.unsubscribe();
  }

  onChange(el2Ref) {
    console.log('cahnge: ', el2Ref);
  }

  toggleRecipe(recipe: any, ref?) {
    console.log('ref: ', ref);
    if (recipe === this.selectedRecipe) {
      ref.classList.remove('grow');
      ref.classList.add('shrink');
      setTimeout(() => {
        this.selectedRecipe = null;
      }, 1000);
    } else {
      this.selectedRecipe = recipe;
      // setTimeout(() => {
      //   this.scroll(ref);
      // }, 100);
    }

    // recipe.selected = !recipe.selected;
  }

  scroll(el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
