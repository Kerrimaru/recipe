// import { Directive, ElementRef, HostListener, Input } from '@angular/core';

// @Directive({
//   selector: '[appShowOnScroll]',
// })
// export class ShowOnScrollDirective {
//   constructor(private el: ElementRef) {}
//   //   @Input() scrollClass: string;
//   @Input() appShowOnScroll = 'app-hidden'; // class to add
//   @Input() offset = 0; // position when to add it

//   @HostListener('window:scroll', ['$event'])
//   checkScroll() {
//     console.log('scroll directive: ', this.el);
//     const options = {
//       // root: null,
//       rootMargin: this.offset + 'px',
//       threshold: 1.0,
//     };

//     const observer = new IntersectionObserver(this.toggleClass.bind(this), options);
//     observer.observe(this.el.nativeElement);
//   }

//   toggleClass(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add(this.appShowOnScroll);
//       } else {
//         // entry.target.classList.remove(this.appShowOnScroll);
//       }
//     });
//   }
// }
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appShowOnScroll]',
})
export class ShowOnScrollDirective {
  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const child = this.el.nativeElement.firstElementChild;

    if (
      rect.top <= 0 ||
      (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
      (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    ) {
      child.classList.remove('app-hidden');
    } else {
      child.classList.add('app-hidden');
    }
  }
}
