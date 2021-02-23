import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'favourite',
})
export class FavouritesPipe implements PipeTransform {
  constructor() {}

  transform(recipeKey: string, favouriteList: string[]): boolean {
    if (!favouriteList) {
      return false;
    }
    if (favouriteList.includes(recipeKey)) {
      return true;
    } else {
      return false;
    }
  }
}
