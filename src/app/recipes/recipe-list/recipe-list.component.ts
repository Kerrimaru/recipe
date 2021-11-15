import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription, BehaviorSubject } from "rxjs";
import { DataStorageService } from "src/app/shared/data-storage.service";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { UserSettingsService } from "src/app/settings/user-settings.service";
import { AuthService } from "src/app/auth/auth.service";
import { DialogService } from "src/app/shared/dialog/dialog.service";
import { User } from "src/app/auth/user.model";
import { AuthComponent } from "src/app/auth/auth.component";
import { RecipeFilterPipe } from "src/app/shared/pipes/recipe-filter.pipe";
@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.scss"],
  providers: [RecipeFilterPipe],
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

  offset = 2;
  loadedCount = 0;

  columns = [];
  columnCount = 1;
  scrollShow = 5;

  @HostListener("window:scroll", ["$event"])
  checkScroll(event) {
    if (window.pageYOffset > 40) {
      this.searchOn = this.searchTerm ? true : false;
      this.maxScroll = true;
    } else {
      this.searchOn = true;
      this.maxScroll = false;
    }
    const mult = Math.floor(window.scrollY / window.innerHeight) + 1;

    this.scrollShow = 5 * mult > this.scrollShow ? 5 * mult : this.scrollShow;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    const prevCount = this.columnCount;
    this.columnCount = this.setColumnCount(event.target.innerWidth);
    if (prevCount !== this.columnCount) {
      this.columns = this.populateColumns(this.allRecipes);
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
    private dialog: DialogService,
    private filterPipe: RecipeFilterPipe
  ) {}

  ngOnInit(): void {
    this.columnCount = this.setColumnCount(window.innerWidth);
    this.userSub = this.authService.user.subscribe((user) => {
      this.readOnly = this.authService.readOnly.getValue();
      this.user = user;
    });
    const notify = this.route.snapshot.queryParams["notify"];
    if (notify) {
      let title = "Welcome";
      let message: string[];
      let actions: any = [{ text: "view recipes" }];
      if (notify === "guest") {
        title += ", Guest!";
        message = [
          "As a guest, feel free to explore! You will be able to preview the site, but with limited functionality.",
          "You can view recipes, but cannot:",
          "add new recipes<br> favourite or bookmark recipes<br> add comments or add dates",
          "and any changes made will not be saved.",
        ];
      } else {
        const testy = history.state.data;
        if (!!testy && !!testy.name) {
          title += ", " + testy.name;
        }

        message = [
          "Thanks for signing up! Get started by",
          "browsing recipes, or add your own straight away!",
        ];
        actions.push({ text: "add new recipe", go: "new", secondary: true });
      }
      this.dialog
        .alert({ title: title, lines: message, actions: actions })
        .subscribe((res) => {
          if (res === "new") {
            this.router.navigate(["recipes", "new"]);
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
      this.allRecipes = [...recipes.reverse()];

      const urlSegment = (this.route.url as BehaviorSubject<any>).getValue();
      this.filter = urlSegment.length ? urlSegment[0].path : null;
      this.recipes = this.handleRoute(this.filter);
      this.columns = this.populateColumns(this.recipes);
      this.loading = false;
    });
  }

  runSearch() {
    if (!this.searchTerm) {
      this.resetAll();
    }
    const arr = this.filterPipe.transform(this.allRecipes, this.searchTerm);
    this.recipes = arr;
    this.columns = this.populateColumns(arr);
  }

  resetAll() {
    this.recipes = this.handleRoute(this.filter);
    this.columns = this.populateColumns(this.recipes);
  }

  populateColumns(recipesArray) {
    const columns = [];
    for (let index = 1; index <= this.columnCount; index++) {
      const name = "column" + index;
      const indexes = [...Array(recipesArray.length).keys()].filter((i) => {
        // console.log('i: ', i, ' col count: ', this.columnCount, ' modulo: ', i % this.columnCount === index - 1);
        return i % this.columnCount === index - 1;
      });
      columns.push({ column: name, indexes: indexes });
    }
    return columns;
  }

  setColumnCount(width) {
    if (width < 600) {
      return 1;
    } else if (width < 800) {
      return 2;
    } else if (width < 1000) {
      return 3;
    } else {
      return 4;
    }
  }

  loadMore() {}

  onImageLoad(event, index) {
    // console.log('event: ', event, ' index: ', index);
    // this.loadedCount++;
    // if (this.loadedCount === this.offset) {
    //   this.offset += 2;
    // }
  }

  handleRoute(key: string, recipeArray?: any[]) {
    const recipeArr = recipeArray ? [...recipeArray] : [...this.allRecipes];
    switch (key) {
      case "to-do":
        return recipeArr.filter((r) => this.toDoList.includes(r.key));
      case "favourites":
        return recipeArr.filter((r) => this.favouritesArr.includes(r.key));
      default:
        return recipeArr;
    }
  }

  handleQueryParams(key: string) {
    const recipeArr = [...this.allRecipes];
    if (key === "toDo") {
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
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scroll({ top: 0, behavior: "smooth" });
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
    const rec =
      this.allRecipes[Math.floor(Math.random() * this.recipes.length)];
    this.router.navigate(["recipes", rec.key]);
  }

  signup() {
    console.log("click signup");
    const dialogRef = this.dialog.show(
      AuthComponent,
      { signup: true },
      { panelClass: "auth-dialog" }
    );
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
