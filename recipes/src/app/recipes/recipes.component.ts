import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
// const Firebase = require('firebase');

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  providers: [],
})
export class RecipesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // const fbRef = window['firebase'];
    // const dbRef = fbRef.database().ref().child('object');
    // console.log('FB ref: ', fbRef, ' db ref: ', dbRef);
    // dbRef.on('value', snap => console.log(snap.val()));
  }
}
