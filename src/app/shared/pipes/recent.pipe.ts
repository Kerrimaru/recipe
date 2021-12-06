import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "recent",
  // pure: false,
})
export class RecentPipe implements PipeTransform {
  transform(value: any, key: string, dateLimit: number, lessThan?: true) {
    const limit = Date.now() - 24 * 60 * 60 * 1000 * dateLimit;

    return value.filter((v) => {
      const lastDate = Math.max(...v[key]);
      return lastDate < limit;
    });
  }
}
