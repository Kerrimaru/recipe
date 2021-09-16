import { Ingredient } from '../shared/ingredient.model';
import { Tag } from '../tags/tag.model';

export class Recipe {
  private _id: string;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: string[] = [];
  public addedBy: string; // user display name
  public userId: string; // added by id
  // public tags: Tag[] = [];
  public tags: string[] = [];
  public key: string;
  public created: number; // utc
  public isFavourite: boolean;
  public time: string;
  // public nutrition: Nutrition[] = NutritionConst;
  // public selected = false;

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
export interface Nutrition {
  name: string;
  units: string;
  amount: number;
}

export const NutritionConst = [
  { name: 'Calories', units: 'kcal', amount: 0 },
  { name: 'Fat', units: 'g', amount: 0 },
  { name: 'Carbs', units: 'g', amount: 0 },
  { name: 'Sugar', units: 'g', amount: 0 },
  { name: 'Protein', units: 'g', amount: 0 },
  { name: 'Fibre', units: 'g', amount: 0 },
];
