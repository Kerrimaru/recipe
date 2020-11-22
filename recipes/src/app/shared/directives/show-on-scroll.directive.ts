import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appShowOnScroll]',
})
export class ShowOnScrollDirective {
  constructor(private el: ElementRef) {}
  //   @Input() scrollClass: string;
  //   scrollClass = 'hello';
  @Input() appShowOnScroll: string;
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    // console.log('directive: ', this);
    // const rect = this.el.nativeElement.getBoundingClientRect();
    // const child = this.el.nativeElement.firstElementChild;

    // if (
    //   rect.top <= 0 ||
    //   (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
    //     rect.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
    //   (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    // ) {
    //   child.classList.remove(this.scrollClass);
    // } else {
    //   child.classList.add(this.scrollClass);
    // }

    // const callback = function(entries) {
    //     entries.forEach(entry => {
    //       entry.target.classList.toggle("is-visible");
    //     });
    //   };
    const options = {
      // root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(this.toggleClass.bind(this), options);
    // console.log('this el ', this.el);
    // console.log('this class name? ', this.appShowOnScroll);

    //   const targets = document.querySelectorAll(".show-on-scroll");
    //   targets.forEach(function(target) {
    observer.observe(this.el.nativeElement);
    //   });
  }

  toggleClass(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    // console.log('visible? ', entry[0].isVisible);
    // console.log('opts: ', observer);
    console.log('entry: ', entries);
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(this.appShowOnScroll);
      } else {
        entry.target.classList.remove(this.appShowOnScroll);
      }
    });

    // entry[0].isVisible
    //   ? entry[0].target.classList.add(this.appShowOnScroll)
    //   : entry[0].target.classList.remove(this.appShowOnScroll);
    // console.log('this in toggle: ', this);
    // console.log('entry: ', entry);
    // console.log('entry: target ', entry[0].target);
    // console.log('entry:  classList ', entry[0].target.classList);
    // console.log('this class name? ', this.appShowOnScroll);
    // entries.forEach(entry => {
    // entry[0].target.classList.toggle(this.appShowOnScroll);
    //   });
  }
}
