import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayIncludes',
})
export class ArrayIncludesPipe implements PipeTransform {
  transform(value: any, array: any[], key?: string): any {
    if (!value || !array || !array.length) {
      return;
    }

    if (array.includes(value[key])) {
      return value;
    } else {
      return null;
    }
  }
}
