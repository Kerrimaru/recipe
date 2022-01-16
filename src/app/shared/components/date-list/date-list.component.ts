import { KeyValue } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-date-list",
  templateUrl: "./date-list.component.html",
  styleUrls: ["./date-list.component.scss"],
})
export class DateListComponent implements OnInit {
  constructor() {}

  @Input() dates: any;
  @Input() showEmptyMonths = false; // show or hide months with no data
  @Input() showEmptyYears = false; // show or hide years with no data

  years: number[];
  yearsList: any;
  sections: any;
  secArray;

  ngOnInit(): void {
    this.sortDates([
      ...this.dates.sort((a, b) => {
        return b.date - a.date;
      }),
    ]);

    // this.arrayDates([
    //   ...this.dates.sort((a, b) => {
    //     return b.date - a.date;
    //   }),
    // ]);
  }

  arrayDates(dates) {
    let arr = [];
    dates.forEach((d) => {
      const date = new Date(d.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const added = arr.find((a) => a.year === year);
      // debugger;
      if (added) {
        const monthAdded = added.months.find((m) => m.month === month);
        if (monthAdded) {
          monthAdded.dates.push(d);
        } else {
          added.months.push({ month: month, dates: [d] });
        }
        9;
      } else {
        arr.push({ year: year, months: [{ month: month, dates: [d] }] });
      }
    });
    this.secArray = arr;
    console.log("arr: ", arr);
  }

  sortDates(dates) {
    let obj = {};

    dates.forEach((d) => {
      const date = new Date(d.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (obj[year]) {
        if (obj[year][month]) {
          obj[year][month].dates.push(d);
        } else {
          obj[year][month] = { dates: [d] };
        }
      } else {
        obj[year] = {
          [month]: { dates: [d] },
        };
      }
    });

    // console.log("obj: ", obj);
    this.sections = obj;
    // console.log("sections: ", this.sections);
  }

  // Preserve original property order
  originalOrder = (
    a: KeyValue<number, string>,
    b: KeyValue<number, string>
  ): number => {
    return 0;
  };

  // Order by descending property key
  desc = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.key > b.key ? -1 : b.key > a.key ? 1 : 0;
  };

  asc = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.key > b.key ? 1 : b.key > a.key ? -1 : 0;
  };
}
