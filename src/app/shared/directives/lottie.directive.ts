import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  NgZone,
} from '@angular/core';
import * as lottie from 'lottie-web';

@Directive({
  selector: '[appLottie]',
})
export class LottieDirective implements OnInit, OnChanges {
  @Input() appLottie: string;
  @Input() loop: boolean;
  @Input() autoplay = true;
  @Input() startFrame: number; // start at specific frame
  @Input() eventListener: string;
  @Input() play: number[]; // [0] to start at begining, or pass in array with start frame and end frame
  @Input() viewbox: string;
  @Input() direction: string; // can be 'forward' or 'backward'

  @Output() eventEmitter = new EventEmitter();

  animationInstance: any;
  // lottie editor here (for frame selection, etc): https://edit.lottiefiles.com/
  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.animationInstance = lottie.loadAnimation({
      container: this.el.nativeElement, // the dom element that will contain the animation
      renderer: 'svg',
      loop: this.loop || false,
      autoplay: this.autoplay,
      path: '/assets/animations/' + this.appLottie + '.json', // the path to the animation json
      rendererSettings: {
        // preserveAspectRatio: 'xMaxYMax',
        viewBoxSize: this.viewbox,
      },
    });

    if (this.startFrame) {
      this.animationInstance.goToAndStop(this.startFrame, true);
    }
    if (this.direction) {
      const dir = this.direction === 'backward' ? -1 : 1;
      this.animationInstance.setDirection(dir);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('change lotte: ', changes, this);
    // console.log('this: ', this);
    if (changes.play) {
      // this.playAnimation();
      this.playAnimation(changes.play.currentValue);
    }
  }

  playAnimation(segments: number[] = [0]) {
    if (!this.animationInstance) {
      return;
    }
    const dir = this.direction === 'backward' ? -1 : 1;
    this.animationInstance.setDirection(dir);
    this.ngZone.runOutsideAngular(() => {
      this.animationInstance.playSegments(segments, true);
    });
  }
}
