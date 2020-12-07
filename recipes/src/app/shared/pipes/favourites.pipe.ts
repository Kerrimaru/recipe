import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'favourite',
})
export class FavouritesPipe implements PipeTransform {
  constructor() {}

  transform(recipeKey: string, favouriteList: string[]): boolean {
    console.log('recipekey ', recipeKey, 'fav: , ', favouriteList);
    if (favouriteList.includes(recipeKey)) {
      return true;
    } else {
      return false;
    }
  }
}
