import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User, UserSettings } from "../auth/user.model";
import { RecipeService } from "../recipes/recipe.service";
import { UserSettingsService } from "./user-settings.service";
// import { NgxChartsModule } from "@swimlane/ngx-charts";
import { Router } from "@angular/router";
import { RecentPipe } from "../shared/pipes/recent.pipe";

export interface RecipePreview {
  name: string;
  id: string;
  image: string;
  value: number;
  dates: number[];
}
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  providers: [RecentPipe],
})
export class SettingsComponent implements OnInit, OnDestroy {
  accountDetailsForm: FormGroup;
  userSettingsForm: FormGroup;
  userSettings: UserSettings;
  user: User;
  userSub: Subscription;
  recDatesList: RecipePreview[] = [];
  recDatesSub: Subscription;
  dateRecipeList: any[] = [];
  totalDates: number;
  selectedRecipe: RecipePreview;
  infrequentList: RecipePreview[] = [];
  topRecipes: RecipePreview[] = [];

  isScrolling = false;
  showLeft = false;
  showRight = false;

  dietOptions = ["Vegan", "Vegetarian", "All"];
  darkMode = false;
  selectedDiet: string;
  // options
  gradient = false;
  showLegend = true;
  showLabels = false;
  isDoughnut = true;
  legendPosition: string = "right"; // below | right

  colorScheme = {
    domain: [
      "#ADD8E6",
      "#ADE6CE",
      "#ADB2E6",
      "#E6BBAD",
      "#E6ADD8",
      "#D8E6AD",
      "#E6ADB2",
      "#B5CCE4",
      "#D8ADE6",
      "#BBE6AD",
    ],
  };

  // @ViewChild("scroll") scrollList: any;

  constructor(
    private authService: AuthService,
    private settingsService: UserSettingsService,
    private router: Router,
    private recipeService: RecipeService,
    private recent: RecentPipe
  ) {}

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.showLegend = event.target.innerWidth > 800;
  }

  onSelect(data: string | RecipePreview): void {
    let name = typeof data === "string" ? data : data.name;
    this.selectedRecipe = this.findRecipeByName(name);
  }

  findRecipeByName(name: string) {
    return this.recDatesList.find((r) => r.name === name);
  }

  onActivate(data): void {
    // console.log("Activate", JSON.parse(JSON.stringify(data)));
    // let name = typeof data === "string" ? data : data.name;
    this.selectedRecipe = this.findRecipeByName(data.value.name);
  }

  onDeactivate(data): void {
    // console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
    if (window.innerWidth < 800) {
      // this.legendPosition = "below";
      this.showLegend = false;
    }
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;

        this.initForms();
        this.getDates();
        // this.isAuth = !!user;
      }
    });
  }

  sample(array: RecipePreview[], limit: number) {
    if (array.length <= limit) {
      return array;
    }
    const sample = [];
    const indexes = [];
    while (sample.length < limit) {
      var index = Math.floor(Math.random() * array.length);
      if (indexes.indexOf(index) === -1) {
        sample.push(array[index]);
        indexes.push(index);
      }
    }
    return sample;
  }

  getDates() {
    this.recipeService.getRecipesMadeSnap(this.user.id).then((list) => {
      list.forEach((rec) => {
        rec.dates.forEach((d) => {
          this.dateRecipeList.push({
            date: d,
            recId: rec.id,
            name: rec.name,
          });
        });
      });
      this.dateRecipeList.sort((a, b) => {
        return b.date - a.date;
      });

      this.recDatesList = list.sort((a, b) => b.value - a.value);
      this.topRecipes = this.recDatesList.slice(0, 10);
      this.selectedRecipe = this.topRecipes[0];
      this.totalDates = list.map((r) => r.value).reduce((a, b) => a + b);
      this.infrequentList = this.sample(
        this.recent.transform(this.recDatesList, "dates", 90),
        10
      );
    });
  }

  private initForms() {
    this.accountDetailsForm = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
    });

    this.userSettingsForm = new FormGroup({
      selectedDiet: new FormControl("", Validators.required),
      dark: new FormControl(this.darkMode, Validators.required),
      // theme: new FormControl("", Validators.required),
    });
  }

  // goToRecipe(id) {
  //   this.router.navigate(["recipes", id]);
  // }

  onChange(e) {
    // this.isChecked = !this.isChecked;
    this.selectedDiet = e.target.name;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  selectTheme(theme: string) {
    document.documentElement.className = "theme-" + theme;
  }

  saveTest() {
    this.settingsService.saveChanges(this.user.id);
  }

  tooltipText({ data }) {
    return `
        <h4 class="tooltip-title">${data.name}</h4>
        <span class="tooltip-text">You've made this <br>${data.value} time${
      data.value > 1 ? "s" : ""
    }</span>
      `;
  }

  scroll(direct, e?: MouseEvent, el?: any) {
    this.isScrolling = true;
    // console.log("scroll ", direct, " e: ", e);
    // console.log("target: ", e.target);
    // console.log("el: ", el);
    do {
      el.scrollLeft += 1;
    } while (this.isScrolling);
    // el.scrollLeft += 1;
    // setTimeout(() => {
    //   this.scroll("left", null, el);
    // }, 100);
    // e.nativeElement.scrollLeft = 100;
    // console.log("scrolllist: ", this.scrollList);
    // this.scrollList.nativeElement.scrollLeft = 100;
  }

  stopScroll() {
    this.isScrolling = false;
  }

  scrollNext(direction: string, elRef: HTMLElement) {
    // console.log("offsetWidth: ", elRef.offsetWidth);
    // console.log("offsetLeft: ", elRef.offsetLeft);

    const scrollBy = direction + 358;

    elRef.scrollBy({ top: 0, left: parseInt(scrollBy), behavior: "smooth" });
  }

  onScroll(e, elRef?: HTMLElement) {
    this.showLeft = elRef.scrollLeft > 0;
    this.showRight = elRef.scrollLeft + elRef.offsetWidth < elRef.scrollWidth;
  }
}
