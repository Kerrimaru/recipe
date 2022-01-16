import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { User } from "../auth/user.model";
import { HostBinding } from "@angular/core";
import { HostListener } from "@angular/core";
import { UserSettingsService } from "../settings/user-settings.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private dataStorageService: DataStorageService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private settingsService: UserSettingsService,
    private router: Router
  ) {}

  login = true;
  user: User;
  isAuth = false;
  isMobile = false;
  headerExpanded = false;
  width: number = window.innerWidth;
  // scrollHeight = 160;
  scrollHeight = 130;
  mobileWidth = 820;
  collapse = false;

  logos = [
    "tools-logo",
    // 'plate-logo',
    "hole-logo",
    // 'book-logo',
    // '-logo',
  ];

  currentLogo = 0;

  navItems = [
    { text: "Recipes", link: "/recipes", tabItem: true },
    { text: "Add a recipe", link: "/recipes/new", tabItem: true },
    { text: "My favourites", link: "/recipes/favourites", tabItem: true },
    { text: "Recipes to Try", link: "/recipes/to-do", tabItem: false },
    { text: "Account", link: "/account", tabItem: false },
    { text: "Logout", action: "logout", tabItem: false, hideMobile: true },
  ];

  @Output() navExpanded = new EventEmitter<boolean>();

  private userSub: Subscription;
  // @Output() featureSelected = new EventEmitter<string>();

  @HostListener("window:click", ["$event.target"])
  onClick(element: HTMLElement) {
    if (this.headerExpanded && element.id !== "nav-open") {
      this.headerExpanded = false;
      this.navExpanded.emit(false);
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.mobileWidth;
  }

  @HostListener("window:scroll", ["$event"])
  checkScroll(event: Event) {
    if (window.pageYOffset >= 16) {
      this.collapse = true;
      // this.scrollHeight = 160 - window.pageYOffset;
      this.scrollHeight = 130 - window.pageYOffset;
    } else {
      this.collapse = false;
      // this.scrollHeight = 160;
      this.scrollHeight = 130;
    }
  }

  ngOnInit(): void {
    this.isMobile = this.width < this.mobileWidth;
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
      this.isAuth = !!user;
    });

    this.route.url.subscribe((params) => {
      this.login = params["login"];
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  // onSelect(feature: string) {
  //   this.featureSelected.emit(feature);
  // }

  onSaveData() {
    // this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
  }

  logout() {
    this.headerExpanded = false;
    this.navExpanded.emit(false);
    this.collapse = false;
    this.authService.logout();
  }

  toggleMenu() {
    if (!this.isMobile) {
      return;
    }
    this.headerExpanded = !this.headerExpanded;
    this.navExpanded.emit(this.headerExpanded);
  }

  toggleFilter(filter: string, enabled: boolean) {
    if (enabled) {
      this.settingsService.setFilters(filter);
    } else {
      this.settingsService.filters = [];
    }
  }

  navAction(action) {
    console.log("action ", action);
    if (action === "logout") {
      this.logout();
    }
  }
}
