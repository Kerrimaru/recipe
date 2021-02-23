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
import { AuthService } from 'src/app/auth/auth.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { User } from 'src/app/auth/user.model';
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
  readOnly: boolean;
  user: User;
  userSub: Subscription;

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
    private settingsService: UserSettingsService,
    private authService: AuthService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => (this.user = user));
    const notify = this.route.snapshot.queryParams['notify'];
    if (notify) {
      let title = 'Welcome';
      let message: string[];
      let actions: any = [{ text: 'view recipes', go: null, primary: true }];
      if (notify === 'guest') {
        title += ', Guest!';
        message = [
          'As a guest, you will be able to preview the site with limited functionality.',
          'You can view up to 30 recipes, but cannot add new ones, favourite recipes, or add comments or dates made.',
        ];
      } else {
        const testy = history.state.data;
        console.log('histoyy data: ', testy);
        // const user = this.authService.user.getValue();
        console.log('user ', this.user);
        // const name = localStorage.getItem('userName');
        console.log('user: ', localStorage.getItem('userName'));
        if (!!testy && !!testy.name) {
          title += ', ' + testy.name;
        }

        // title += this.authService.user.getValue().name;
        message = ['Thanks for signing up! Get started by', 'browsing recipes, or add your own straight away!'];
        actions.push({ text: 'add new recipe', go: 'new', secondary: true });
      }
      this.dialog.simple({ title: title, lines: message, actions: actions }).subscribe((res) => {
        if (res === 'new') {
          this.router.navigate(['recipes', 'new']);
        }
      });
    }
    this.readOnly = this.authService.readOnly.getValue();
    this.favsSub = this.settingsService.favs$.subscribe((res) => {
      this.favouritesArr = res;
    });

    this.filtersSub = this.settingsService.filtersChanged.subscribe((res) => {
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
    this.userSub.unsubscribe();
  }

  favourite(recipe: Recipe) {
    if (this.readOnly) {
      return;
    }
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
