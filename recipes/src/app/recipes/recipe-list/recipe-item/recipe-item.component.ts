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

  ngOnInit(): void {}

  scroll() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
