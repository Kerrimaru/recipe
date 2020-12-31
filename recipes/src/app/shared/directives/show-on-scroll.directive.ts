import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appShowOnScroll]',
})
export class ShowOnScrollDirective {
  constructor(private el: ElementRef) {}
  //   @Input() scrollClass: string;
  @Input() appShowOnScroll: string; // class to add
  @Input() offset = 0; // position when to add it

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const options = {
      // root: null,
      rootMargin: this.offset + 'px',
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
