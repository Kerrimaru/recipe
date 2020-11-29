import { HostListener } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss'],
})
export class RecipeItemComponent implements OnInit {
  constructor() {}

  @Input() recipe: Recipe;
  @Input() index: number;

  flipped = false;
  expanded = false;
  isMobile: boolean;
  width: number = window.innerWidth;
  mobileWidth = 760;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.mobileWidth;
  }

  ngOnInit(): void {
    this.isMobile = this.width < this.mobileWidth;
  }

  scroll() {
    // this.flipped = !this.flipped; // testing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  swipe(e) {
    if (!this.isMobile) {
      return;
    }
    this.flipped = !this.flipped;
  }

  expand() {
    this.expanded = true;
  }
}
