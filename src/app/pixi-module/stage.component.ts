import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {IPIXIOptions, PIXIScreen} from './PIXIScreen';
import {animate, keyframes, style} from '@angular/animations';
import {ɵDomSharedStylesHost as DomSharedStylesHost} from '@angular/platform-browser';
import {interval} from 'rxjs';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-stage',
  template: `
    <text [x]="100" [y]="100" [text]="'asdsd'" [rotation]="rotation" [ngStyle]="{fill: '#ff0000'}"></text>
    <sprite [texture]="texture"></sprite>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    animate('5s', keyframes([
      style({ backgroundColor: 'red', offset: 0 }),
    ]))
  ],
})
export class StageComponent implements OnInit {

  rotation = 0;
  // tslint:disable-next-line:max-line-length
  texture = PIXI.Texture.from('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==');

  constructor(
    private screen: PIXIScreen,
    private rootElementRef: ElementRef,
    private detectorRef: ChangeDetectorRef,
    private host: DomSharedStylesHost,

  ) {
    // console.log(this.host.getAllStyles());
    // this.screen.makeApp(this.options);
  }

  @Input() options: IPIXIOptions = {};

  ngOnInit() {
    this.rootElementRef.nativeElement.appendChild(this.screen.view);

    interval(100)
      .subscribe(() => {
        this.rotation += 0.1;
        this.detectorRef.markForCheck();
      });

    // const style = new PIXI.TextStyle({
    //   fill: '#122dc2',
    //   fontFamily: '"Arial Black", Gadget, sans-serif',
    //   fontSize: 27
    // });
    // const text = new PIXI.Text('Hello World', style);
    //
    // text.x = 10;
    // text.y = 10;
    //
    // this.screen.selectRootElement().addChild(text);
  }
}
