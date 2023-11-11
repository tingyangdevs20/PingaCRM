import { Directive, ElementRef, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Directive({
  selector: '[live-tile]'
})

export class LiveTileDirective implements OnInit {
  $el: any;

  constructor(el: ElementRef) {
    this.$el = $(el.nativeElement);
  }

  ngOnInit(): void {
    this.$el
      .css('height', this.$el.data('height'))
      .liveTile();
  }
}