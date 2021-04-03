import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, HostListener } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
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
import { AuthComponent } from 'src/app/auth/auth.component';
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

  toDoSub: Subscription;
  toDoList: string[];

  selectedRecipe: Recipe;
  searchOn = true;
  // isShowFavourites: boolean;
  favsSub: Subscription;
  maxScroll: boolean;
  loading = true;
  filters: string[] = [];
  readOnly: boolean; // true is signed in as guest
  user: User;
  userSub: Subscription;

  filtersSub: Subscription;

  recipesVisible: any[];
  filter: string;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if (window.pageYOffset > 40) {
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
    // this.route.queryParams.subscribe((res) => {
    //   if (res) {
    //     this.recipes = this.handleRoute(Object.keys(res)[0]);
    //   }
    // });

    this.userSub = this.authService.user.subscribe((user) => {
      this.readOnly = this.authService.readOnly.getValue();
      this.user = user;
    });
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
        // const user = this.authService.user.getValue();
        // const name = localStorage.getItem('userName');
        // console.log('user: ', localStorage.getItem('userName'));
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

    this.favsSub = this.settingsService.favs$.subscribe((res) => {
      this.favouritesArr = res;
      console.log('favs arr: ', this.favouritesArr);
    });
    this.toDoSub = this.settingsService.toDo$.subscribe((res) => {
      this.toDoList = res;
    });
    this.toDoSub = this.settingsService.toDo$.subscribe((res) => {
      this.toDoList = res;
    });

    // this.filtersSub = this.settingsService.filtersChanged.subscribe((res) => {
    //   console.log('is this configured? ');
    //   this.filters = res;
    //   this.recipes = this.applyFilters(this.recipes.slice(), res);
    // });

    // this.isShowFavourites = this.router.url.valueOf() === '/recipes/favourites' ? true : false;
    // console.log('routeR: ', this.router, this.router.url);

    // this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
    //   this.isShowFavourites = e.url === '/recipes/favourites' ? true : false;
    //   console.log('nav change event: ', e);
    //   this.loading = false;
    // });

    // this.route.url.subscribe((url) => {
    //   this.filter = url[0] ? url[0].path : null;
    //   this.loading = false;
    //   console.log('url: ', url, ' filter: ', this.filter);
    //   this.recipes = this.handleRoute(this.filter, this.allRecipes).reverse();
    // });

    this.recipesSub = this.recipeService.recipes$.subscribe((recipes) => {
      this.allRecipes = [...recipes];

      const urlSegment = (this.route.url as BehaviorSubject<any>).getValue();
      this.filter = urlSegment.length ? urlSegment[0].path : null;
      this.recipes = this.handleRoute(this.filter).reverse();
      this.loading = false;
    });
  }

  // this is fake, do it for real at some point :(
  // applyFilters(recipeList: Recipe[], filter: string[]) {
  //   return recipeList.filter((r) => {
  //     return filter.includes(r.key);
  //     // return r.addedBy === 'Kerri';
  //   });
  // }

  handleRoute(key: string, recipeArray?: any[]) {
    const recipeArr = recipeArray ? [...recipeArray] : [...this.allRecipes];
    switch (key) {
      case 'to-do':
        return recipeArr.filter((r) => this.toDoList.includes(r.key));
      case 'favourites':
        return recipeArr.filter((r) => this.favouritesArr.includes(r.key));
      default:
        return recipeArr;
    }
  }

  handleQueryParams(key: string) {
    const recipeArr = [...this.allRecipes];
    console.log('all: ', recipeArr);
    console.log('to do: ', this.toDoList);
    if (key === 'toDo') {
      const filt = recipeArr.filter((r) => {
        return this.toDoList.includes(r.key);
      });
      console.log('filt ', filt);
      return filt;
    }
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

  signup() {
    const dialogRef = this.dialog.show(AuthComponent, { signup: true }, { panelClass: 'auth-dialog' });
    const onClose = dialogRef.afterClosed();
    onClose.subscribe((userName) => {
      if (!!userName) {
        this.recipeService.fetchRecipes().subscribe((res) => {
          // shouldnt need to do this? investigate
          this.allRecipes = res;
          this.recipes = res.reverse();
        });
        // show welcome message
      }
    });
  }
}
