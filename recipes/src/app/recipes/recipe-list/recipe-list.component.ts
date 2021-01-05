import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, HostListener } from '@angular/core';
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
  allRecipes: Recipe[] = [];
  recipesSub: Subscription;
  // recipeList: Observable<any[]>;
  searchTerm: string;
  favouritesArr: any[];
  selectedRecipe: Recipe;
  searchOn = true;
  isShowFavourites: boolean;
  favsSub: Subscription;
  maxScroll: boolean;
  loading = true;
  filters: string[] = [];

  filtersSub: Subscription;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if (window.pageYOffset > 128) {
      this.searchOn = this.searchTerm ? true : false;
      this.maxScroll = true;
    } else {
      this.searchOn = true;
      this.maxScroll = false;
    }
  }

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

    this.filtersSub = this.settingsService.filtersChanged.subscribe((res) => {
      console.log('filter changed res: ', res);
      this.filters = res;
      this.recipes = this.applyFilters(this.recipes.slice(), res);
    });

    this.isShowFavourites = this.router.url.valueOf() === '/recipes/favourites' ? true : false;
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      this.isShowFavourites = e.url === '/recipes/favourites' ? true : false;
      this.loading = false;
    });

    this.recipesSub = this.recipeService.recipes$.subscribe((recipes) => {
      if (this.isShowFavourites) {
        this.filters.push('favourites');
      }
      this.allRecipes = recipes;
      if (this.filters.length) {
        this.recipes = this.applyFilters(recipes, this.filters).reverse();
      } else {
        this.recipes = recipes.reverse();
      }

      this.loading = false;
    });
  }

  // this is fake, do it for real at some point :(
  applyFilters(recipeList: Recipe[], filter: string[]) {
    return recipeList.filter((r) => {
      return this.favouritesArr.includes(r.key);
      return r.addedBy === 'Kerri';
    });
  }

  ngOnDestroy() {
    this.recipesSub.unsubscribe();
    this.favsSub.unsubscribe();
  }

  favourite(recipe: Recipe) {
    this.settingsService.toggleFavourite(recipe.key);
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
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scroll({ top: 0, behavior: 'smooth' });
    }
  }

  searchBlur() {
    if (!this.maxScroll) {
      // do nothing
      return;
    } else if (!this.searchTerm) {
      this.searchOn = false;
    }
  }

  randomRecipe() {
    const rec = this.recipes[Math.floor(Math.random() * this.recipes.length)];
    this.router.navigate(['recipes', rec.key]);
  }
}
