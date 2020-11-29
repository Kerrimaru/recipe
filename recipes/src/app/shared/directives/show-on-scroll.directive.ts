import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appShowOnScroll]',
})
export class ShowOnScrollDirective {
  constructor(private el: ElementRef) {}
  //   @Input() scrollClass: string;
  @Input() appShowOnScroll: string;
  @Input() offset: number;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const options = {
      // root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(this.toggleClass.bind(this), options);
    observer.observe(this.el.nativeElement);
  }

  toggleClass(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(this.appShowOnScroll);
      } else {
        entry.target.classList.remove(this.appShowOnScroll);
      }
    });
  }
}
