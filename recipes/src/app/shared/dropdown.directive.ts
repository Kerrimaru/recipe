import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;
  //   @HostBinding('class') className = 'closed';
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
  constructor(private elRef: ElementRef) {}

  //   @HostListener('click') toggleOpen(eventData: Event) {
  //     this.isOpen = !this.isOpen;
  //     // this.className = 'open';
  //   }

  //   @HostListener('mouseleave') mouseLeave(eventData: Event) {
  //     console.log('exit');
  //     this.className = 'closed';
  //   }
}
