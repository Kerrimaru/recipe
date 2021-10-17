import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recipeFilter',
})
export class RecipeFilterPipe implements PipeTransform {
  static recipeContains(source: string | string[], keyword: string) {
    if (!source) {
      return ''.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
    }
    if (typeof source === 'string') {
      return source.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
    } else {
      const arr = source.map((s) => {
        return (s || '').toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
      if (arr.some((a) => !!a)) {
        return true;
      }
    }
  }

  transform(recipes: any[], searchTerm: string): any[] {
    if (!searchTerm) {
      return recipes;
    }

    const _recipes = recipes.filter((rec) => {
      let value;

      if (rec.value) {
        value = rec.value;
      } else {
        value = rec;
      }
      const result =
        RecipeFilterPipe.recipeContains(value.ingredients, searchTerm) ||
        RecipeFilterPipe.recipeContains(value.name, searchTerm) ||
        RecipeFilterPipe.recipeContains(value.addedBy, searchTerm);
      // RecipeFilterPipe.recipeContains(value.tags, searchTerm) ||;

      return result;
    });
    return _recipes;
  }
}
