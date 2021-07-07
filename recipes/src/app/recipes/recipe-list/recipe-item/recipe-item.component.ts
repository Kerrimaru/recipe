import { EventEmitter, HostListener, Output } from '@angular/core';
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
  @Input() index: number; // not being used
  @Input() isFavourite: boolean;
  @Input() showFavouriteIcon = true;

  @Output() favouriteEmitter = new EventEmitter<string>();

  flipped = false;
  // expanded = false;
  isNew = false; // set to true if added date within 1 week
  isMobile: boolean;
  width: number = window.innerWidth;
  mobileWidth = 760;
  inView = true;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.mobileWidth;
  }

  ngOnInit(): void {
    this.isMobile = this.width < this.mobileWidth;
    // console.log('recipe: ', this.recipe);

    const oneWeek = 1000 * 60 * 60 * 24 * 7; // milliseconds * seconds * minutes * hours * days
    this.isNew = this.recipe.created > Date.now() - oneWeek;
  }

  scroll() {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  swipe(e) {
    if (!this.isMobile) {
      return;
    }
    // console.log('swipe event: ', e);
    this.flipped = !this.flipped;
  }

  expand() {
    // this.expanded = true;
  }

  favourite(e: MouseEvent) {
    e.stopPropagation();
    this.isFavourite = !this.isFavourite;
    this.favouriteEmitter.emit();
    // this.settingsService.toggleFavourite(this.recipe.key);
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
