import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {
  constructor() {}

  navItems = [
    { text: 'Recipes', link: '/recipes' },
    { text: '+New Recipe', link: '/recipes/new' },
    { text: 'My Favourites', link: '/recipes/favourites' },
  ];

  isMobile = false;
  headerExpanded = false;
  collapse = false;
  navLeft = false;

  ngOnInit(): void {
    console.log('nav is here');
  }
}
