import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';
import {Subject} from 'rxjs';
import {debounceTime, map, tap} from 'rxjs/operators';
import DisplayObject = PIXI.DisplayObject;

export interface IPIXIOptions {
  autoStart?: boolean;
  width?: number;
  height?: number;
  view?: HTMLCanvasElement;
  transparent?: boolean;
  autoDensity?: boolean;
  antialias?: boolean;
  preserveDrawingBuffer?: boolean;
  resolution?: number;
  forceCanvas?: boolean;
  backgroundColor?: number;
  clearBeforeRender?: boolean;
  forceFXAA?: boolean;
  powerPreference?: string;
  sharedTicker?: boolean;
  sharedLoader?: boolean;
  resizeTo?: Window | HTMLElement;
}

interface IAttributes {
  [key: string]: any;
}

export interface IDomItem extends IAttributes {
  $id: string;
  $tag: string;
  $parent?: string;
}

@Injectable()
export class PIXIScreen {
  screen: PIXI.Container;
  pseudoDOM: IDomItem[] = [];

  private application: PIXI.Application;
  private objectsMap = new Map<string, PIXI.DisplayObject>();
  private delegateTagCreate$ = new Subject<IDomItem>();
  private delegateTagChange$ = new Subject<IDomItem>();

  get view(): HTMLCanvasElement {
    return this.application.view;
  }

  constructor() {
    this.makeApp({backgroundColor: 0xffffffff});
    this.init();

    const delegatedTagQueue = new Set<IDomItem>();

    this.delegateTagCreate$.pipe(
      tap(tag => delegatedTagQueue.add(tag)),
      debounceTime(10),
      map(() =>
        [...delegatedTagQueue].map(tag => {
          const constructor = this.getElementConstructor(tag.$tag);
          const displayObject = constructor(tag);

          this.objectsMap.set(tag.$id, displayObject);

          return displayObject;
        })
      ),
      tap(displayObjects => this.screen.addChild(...displayObjects)),
      tap(() => delegatedTagQueue.clear()),
    ).subscribe();

    this.delegateTagChange$.pipe(
      debounceTime(10)
    ).subscribe(tag => {
      const displayObject = this.objectsMap.get(tag.$id);

      this.applyAttrs(displayObject, tag);
    });
  }

  private applyAttrs(displayObject: DisplayObject, attrs: IAttributes) {
    Object.keys(attrs).forEach(key => {
      if (key.startsWith('$')) {
        return;
      }

      if (key === 'style' && displayObject instanceof PIXI.Text) {
        displayObject.style = new PIXI.TextStyle(attrs.style);
        return;
      }

      displayObject[key] = attrs[key];
    });
  }

  private getElementConstructor(name: string): (attributes: IAttributes) => PIXI.DisplayObject {
    const makeConstructor = (constructor: (attrs) => PIXI.DisplayObject) => attrs => {
      const node = constructor(attrs);

      this.applyAttrs(node, attrs);

      console.log('node', attrs, node);

      return node;
    };

    switch (name) {
      case 'text':
        return makeConstructor(attrs => new PIXI.Text(attrs.text, attrs.style));
      case 'sprite':
        return makeConstructor(attrs => new PIXI.Sprite(attrs.texture));
      default:
        return makeConstructor(attrs => new PIXI.Container());
    }
  }

  makeApp(options: IPIXIOptions) {
    this.application = new PIXI.Application(options);
  }

  delegateTag(tag: IDomItem) {
    this.pseudoDOM.push(tag);
    this.delegateTagCreate$.next(tag);
  }

  delegateTagChanges(tag: IDomItem) {
    this.delegateTagChange$.next(tag);
  }

  selectRootElement(): PIXI.Container {
    return this.screen;
  }

  private init() {
    this.screen = this.application.stage;
  }
}
