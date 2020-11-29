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
  recipes: Recipe[] = [];
  recipesSub: Subscription;
  recipeList: Observable<any[]>;
  searchTerm: string;
  favouritesArr: any[];
  selectedRecipe: Recipe;
  searchOn = false;
  isShowFavourites: boolean;
  favsSub: Subscription;

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
    this.favsSub = this.settingsService.favs$.subscribe((res) => {
      this.favouritesArr = res;
    });

    this.isShowFavourites = this.router.url.valueOf() === '/recipes/favourites' ? true : false;
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      this.isShowFavourites = e.url === '/recipes/favourites' ? true : false;
    });

    this.recipesSub = this.recipeService.recipes$.subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  ngOnDestroy() {
    this.recipesSub.unsubscribe();
    this.favsSub.unsubscribe();
  }

  toggleRecipe(recipe: any, ref?) {
    // if (recipe === this.selectedRecipe) {
    //   ref.classList.remove('grow');
    //   ref.classList.add('shrink');
    //   setTimeout(() => {
    //     this.selectedRecipe = null;
    //   }, 1000);
    // } else {
    //   this.selectedRecipe = recipe;
    //   // setTimeout(() => {
    //   //   this.scroll(ref);
    //   // }, 100);
    // }
    // recipe.selected = !recipe.selected;
  }

  scroll(el?) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
