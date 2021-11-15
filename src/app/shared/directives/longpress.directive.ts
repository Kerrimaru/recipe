import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";

@Directive({
  selector: "[appLongpress]",
})
export class LongpressDirective implements OnInit {
  constructor(private el: ElementRef) {}
  pressing: boolean;
  @Input() disabled: false;
  @Output() pressStartEmitter = new EventEmitter();
  @Output() pressEndEmitter = new EventEmitter();

  @HostListener("mousedown", ["$event"])
  @HostListener("touchstart", ["$event"])
  onPress(event) {
    if (this.disabled) {
      return;
    }
    this.pressing = true;
    event.preventDefault();
    console.log("press: ", event);
    this.pressStartEmitter.emit();
  }

  @HostListener("touchend", ["$event"])
  @HostListener("mouseup")
  @HostListener("mouseleave")
  onPressRelease(event) {
    if (this.disabled) {
      return;
    }
    this.pressing = false;
    this.pressEndEmitter.emit();
    console.log("release: ", event);
  }

  ngOnInit() {
    console.log("this: ", this);
  }
}
