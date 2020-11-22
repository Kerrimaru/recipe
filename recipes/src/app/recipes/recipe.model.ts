import { Ingredient } from '../shared/ingredient.model';
import { Tag } from '../tags/tag.model';

import * as moment from 'moment';

export class Recipe {
  private _id: string;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public addedBy: string; // user name
  public userId: string; // added by id
  public tags: Tag[];
  public favourite = false; // need to move to user settings
  public key: string;
  public created = moment().format();
  public selected = false;

  // constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[], addedBy: string) {
  //   this.name = name;
  //   this.description = desc;
  //   this.imagePath = imagePath;
  //   this.ingredients = ingredients;
  //   this.addedBy = addedBy;
  //   this.favourite = false;
  // }

  get id() {
    return this._id;
  }
}
