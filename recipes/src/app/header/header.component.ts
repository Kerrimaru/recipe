import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';
import { HostBinding } from '@angular/core';
import { HostListener } from '@angular/core';
import { UserSettingsService } from '../settings/user-settings.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
  // height: number = window.innerHeight;
  mobileWidth = 760;
  collapse = false;
  hideHeader: boolean;

  logos = [
    'tools-logo',
    // 'plate-logo',
    'hole-logo',
    // 'book-logo',
    // '-logo',
  ];

  currentLogo = 0;

  navItems = [
    { text: 'Recipes', link: '/recipes' },
    { text: '+New Recipe', link: '/recipes/new' },
    { text: 'My Favourites', link: '/recipes/favourites' },
  ];

  private userSub: Subscription;
  // @Output() featureSelected = new EventEmitter<string>();

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.mobileWidth;
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    // console.log('offset: ', window.pageYOffset);
    if (window.pageYOffset >= 40) {
      this.collapse = true;
    } else {
      this.collapse = false;
    }
  }

  advanceLogo() {
    this.currentLogo++;
    if (this.currentLogo >= this.logos.length) {
      this.currentLogo = 0;
    }
  }

  ngOnInit(): void {
    // this.hideHeader = this.router.url.valueOf() === '/login' ? true : false;
    // this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
    //   this.hideHeader = e.url === '/login' ? true : false;
    //   // this.loading = false;
    // });

    this.isMobile = this.width < this.mobileWidth;
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
      this.isAuth = !!user;
    });

    this.route.url.subscribe((params) => {
      this.login = params['login'];
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
    this.authService.logout();
  }

  toggleMenu() {
    if (!this.isMobile) {
      return;
    }

    this.headerExpanded = !this.headerExpanded;
  }

  toggleFilter(filter: string, enabled: boolean) {
    if (enabled) {
      this.settingsService.setFilters(filter);
    } else {
      this.settingsService.filters = [];
    }
  }
}
