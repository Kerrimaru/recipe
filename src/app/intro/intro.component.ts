import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit {
  constructor() {}

  @HostListener('window:scroll', ['$event'])
  checkScroll(event) {
    // console.log('event: ', event);
    if (window.pageYOffset >= 40) {
    } else {
    }
  }

  ngOnInit(): void {}
}
