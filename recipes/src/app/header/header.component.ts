import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';
import { HostBinding } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private dataStorageService: DataStorageService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  login = true;
  user: User;
  isAuth = false;
  isMobile = false;
  headerExpanded = false;
  width: number = window.innerWidth;
  // height: number = window.innerHeight;
  mobileWidth = 760;

  private userSub: Subscription;
  // @Output() featureSelected = new EventEmitter<string>();

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.mobileWidth;
  }

  ngOnInit(): void {
    this.isMobile = this.width < this.mobileWidth;
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
      // console.log('user in header: ', user);
      this.isAuth = !!user;
    });

    this.route.url.subscribe((params) => {
      this.login = params['login'];
      console.log('params in header: ', params);
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
    this.dataStorageService.fetchRecipes().subscribe();
  }

  logout() {
    this.authService.logout();
  }

  toggleMenu() {
    if (!this.isMobile) {
      return;
    }
    console.log('click');
    this.headerExpanded = !this.headerExpanded;
  }
}
