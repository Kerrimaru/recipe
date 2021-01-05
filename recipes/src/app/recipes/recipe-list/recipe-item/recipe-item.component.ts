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
  expanded = false;
  isNew = false; // set to true if added date within 1 week
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
    // console.log('recipe: ', this.recipe);

    const oneWeek = 1000 * 60 * 60 * 24 * 7; // milliseconds * seconds * minutes * hours * days
    this.isNew = this.recipe.created > Date.now() - oneWeek;
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

  favourite(e: MouseEvent) {
    e.stopPropagation();
    this.isFavourite = !this.isFavourite;
    this.favouriteEmitter.emit();
    // this.settingsService.toggleFavourite(this.recipe.key);
  }
}
