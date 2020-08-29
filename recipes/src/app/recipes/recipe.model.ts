import { Ingredient } from '../shared/ingredient.model';
import { Tag } from '../tags/tag.model';

export class Recipe {
  private _id: string;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public addedBy: string;
  public tags: Tag[];

  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[], addedBy: string) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
    this.addedBy = addedBy;
  }

  get id() {
    return this._id;
  }
}
