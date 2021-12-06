import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { map, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User, UserSettings } from "../auth/user.model";
import { RecipeService } from "../recipes/recipe.service";
import { UserSettingsService } from "./user-settings.service";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { Recipe } from "../recipes/recipe.model";
import { Router } from "@angular/router";
// import { single } from "./data";

// component not yet in use
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit, OnDestroy {
  accountDetailsForm: FormGroup;
  userSettingsForm: FormGroup;
  userSettings: UserSettings;
  user: User;
  userSub: Subscription;
  recDatesList = [];
  recDatesSub: Subscription;
  totalDates: any;
  selectedRecipe: any;

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

  constructor(
    private authService: AuthService,
    private settingsService: UserSettingsService,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
    console.log("data: ", data);
    this.selectedRecipe = this.findRecipeByName(data);
  }

  findRecipeByName(name: string) {
    return this.recDatesList.find((r) => r.name === name);
  }

  onActivate(data): void {
    // console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;

        this.initForms();
        // console.log("this: ", this);
        this.getDates();
        // this.isAuth = !!user;
      }
    });
  }

  getDates() {
    this.recipeService.getRecipesMadeSnap(this.user.id).then((list) => {
      this.recDatesList = list.sort((a, b) => b.value - a.value);
      this.totalDates = list.map((r) => r.value).reduce((a, b) => a + b);
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

  goToRecipe(id) {
    this.router.navigate(["recipes", id]);
  }

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
}
