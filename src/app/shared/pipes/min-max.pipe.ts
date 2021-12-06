import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "minMax",
})
export class MinMaxPipe implements PipeTransform {
  transform(array: number[], max = true, limit = 1): number[] {
    return array.sort((a, b) => (max ? a - b : b - a)).slice(0, limit);
  }
}
