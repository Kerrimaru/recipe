import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { map, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User, UserSettings } from "../auth/user.model";
import { RecipeService } from "../recipes/recipe.service";
import { UserSettingsService } from "./user-settings.service";

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

  dietOptions = ["Vegan", "Vegetarian", "All"];
  mode = "light"; // can be light or dark

  selectedDiet: string;

  constructor(
    private authService: AuthService,
    private settingsService: UserSettingsService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = user;

        this.initForms();
        console.log("this: ", this);
        this.getDates();
        // this.isAuth = !!user;
      }
    });
  }

  getDates() {
    this.recipeService.getRecipesMadeSnap(this.user.id).then((list) => {
      this.recDatesList = list;
      this.totalDates = list
        .map((r) => {
          return r.dates.length;
        })
        .reduce((a, b) => a + b);
      // .map((rec) => {
      // rec.title = this.getRecipeName(rec.id);
      // return rec;
      // });
    });
  }

  getRecipeName(recipeKey: string) {
    console.log("rec key: ", recipeKey);
    return this.recipeService.getRecipeByKey(recipeKey).name;
  }

  private initForms() {
    this.accountDetailsForm = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
    });

    this.userSettingsForm = new FormGroup({
      selectedDiet: new FormControl("", Validators.required),
      theme: new FormControl("", Validators.required),
    });
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
