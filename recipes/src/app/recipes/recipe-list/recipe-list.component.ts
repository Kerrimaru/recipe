import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserSettingsService } from 'src/app/settings/user-settings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { User } from 'src/app/auth/user.model';
import { AuthComponent } from 'src/app/auth/auth.component';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  allRecipes: Recipe[] = [];

  searchTerm: string;
  searchOn = true;
  favouritesArr: any[];
  toDoList: string[];
  selectedRecipe: Recipe;

  maxScroll: boolean;
  loading = true;
  filters: string[] = [];
  readOnly: boolean; // true is signed in as guest
  user: User;

  toDoSub: Subscription;
  userSub: Subscription;
  favsSub: Subscription;
  filtersSub: Subscription;
  recipesSub: Subscription;

  recipesVisible: any[];
  filter: string;

  @HostListener('window:scroll', ['$event'])
  checkScroll(event) {
    // console.log('scrl? ', event);
    // console.log('clientHeight: ', event.target.documentElement.clientHeight);
    // console.log('window.pageYOffset ', window.pageYOffset);
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
    this.userSub = this.authService.user.subscribe((user) => {
      this.readOnly = this.authService.readOnly.getValue();
      this.user = user;
    });
    const notify = this.route.snapshot.queryParams['notify'];
    if (notify) {
      let title = 'Welcome';
      let message: string[];
      let actions: any = [{ text: 'view recipes' }];
      if (notify === 'guest') {
        title += ', Guest!';
        message = [
          'As a guest, feel free to explore! You will be able to preview the site, but with limited functionality.',
          'You can view up to <b>30 recipes</b>, but cannot:',
          'add new recipes<br> favourite or bookmark recipes<br> add comments or add dates',
          'and any changes made will not be saved.',
        ];
      } else {
        const testy = history.state.data;
        if (!!testy && !!testy.name) {
          title += ', ' + testy.name;
        }

        message = ['Thanks for signing up! Get started by', 'browsing recipes, or add your own straight away!'];
        actions.push({ text: 'add new recipe', go: 'new', secondary: true });
      }
      this.dialog.alert({ title: title, lines: message, actions: actions }).subscribe((res) => {
        if (res === 'new') {
          this.router.navigate(['recipes', 'new']);
        }
      });
    }

    this.favsSub = this.settingsService.favs$.subscribe((res) => {
      this.favouritesArr = res;
    });
    this.toDoSub = this.settingsService.toDo$.subscribe((res) => {
      this.toDoList = res;
    });

    this.recipesSub = this.recipeService.recipes$.subscribe((recipes) => {
      this.allRecipes = [...recipes];

      const urlSegment = (this.route.url as BehaviorSubject<any>).getValue();
      this.filter = urlSegment.length ? urlSegment[0].path : null;
      this.recipes = this.handleRoute(this.filter).reverse();
      this.loading = false;
    });
  }

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
    if (key === 'toDo') {
      const filt = recipeArr.filter((r) => {
        return this.toDoList.includes(r.key);
      });
      return filt;
    }
  }

  ngOnDestroy() {
    this.favsSub.unsubscribe();
    this.userSub.unsubscribe();
    this.toDoSub.unsubscribe();
    this.recipesSub.unsubscribe();
    // doesnt exist yet
    // this.filtersSub.unsubscribe();
  }

  favourite(recipe: Recipe) {
    if (this.readOnly) {
      return;
    }
    this.settingsService.toggleFavourite(recipe.key);
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
    const rec = this.allRecipes[Math.floor(Math.random() * this.recipes.length)];
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

  // this is fake, do it for real at some point :(

  // applyFilters(recipeList: Recipe[], filter: string[]) {
  //   return recipeList.filter((r) => {
  //     return filter.includes(r.key);
  //     // return r.addedBy === 'Kerri';
  //   });
  // }

  // this.filtersSub = this.settingsService.filtersChanged.subscribe((res) => {
  //   console.log('is this configured? ');
  //   this.filters = res;
  //   this.recipes = this.applyFilters(this.recipes.slice(), res);
  // });

  // this.isShowFavourites = this.router.url.valueOf() === '/recipes/favourites' ? true : false;

  // this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
  //   this.isShowFavourites = e.url === '/recipes/favourites' ? true : false;
  //   this.loading = false;
  // });

  // this.route.url.subscribe((url) => {
  //   this.filter = url[0] ? url[0].path : null;
  //   this.loading = false;
  //   this.recipes = this.handleRoute(this.filter, this.allRecipes).reverse();
  // });
}
