import {Injectable, NgZone, Renderer2, RendererFactory2, RendererStyleFlags2, RendererType2} from '@angular/core';
import * as PIXI from 'pixi.js';

import {IDomItem, PIXIScreen} from './PIXIScreen';
import {ɵDomRendererFactory2 as DomRendererFactory2} from '@angular/platform-browser';

@Injectable()
export class PixiRendererFactory implements RendererFactory2 {
  constructor(
    private domRendererFactory: DomRendererFactory2,
    private screen: PIXIScreen,
    private zone: NgZone,
  ) {}

  end() {
    // this.screen.selectRootElement().render();
  }

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    const delegate = this.domRendererFactory.createRenderer(hostElement, type);

    if (!hostElement || !type || !type.data || !type.data.animation) {
      return delegate;
    }

    return new PixiRenderer(this.screen);
  }
}

export class PixiRenderer implements Renderer2 {
  readonly data: { [p: string]: any };

  destroyNode: ((node: any) => void) | null;

  constructor(private screen: PIXIScreen) {}

  private createTag(name: string, attrs: {[key: string]: any} = {}): IDomItem {
    return {
      ...attrs,
      $id: Math.random().toString(36).substr(3),
      $tag: name,
    };
  }

  createElement(name: string, namespace?: string | null): IDomItem {
    const newTag = this.createTag(name);

    this.screen.delegateTag(newTag);

    // return this.screen.createElement(name, '');
    return newTag;
  }

  createText(value: string): IDomItem {
    const newTag = this.createTag('text', {text: value});

    this.screen.delegateTag(newTag);

    // return this.screen.createElement('text', value);
    return newTag;
  }

  selectRootElement(): PIXI.Container {
    return this.screen.selectRootElement();
  }

  addClass(el: IDomItem, name: string): void {}

  appendChild(parent: IDomItem, newChild: IDomItem): void {
    // if (newChild) {
    //   parent.addChild(newChild);
    // }
    newChild.$parent = parent.$id;

    // this.screen.screen.addChild(newChild);
  }

  createComment(value: string): any {
  }

  destroy(): void {
  }

  insertBefore(parent: IDomItem, newChild: IDomItem, refChild: IDomItem): void {
  }

  listen(target: IDomItem, eventName: string, callback: (event: any) => (boolean | void)): () => void {
    target.on('click', callback);

    return () => {};
  }

  nextSibling(node: IDomItem): any {
  }

  parentNode(node: IDomItem): any {
  }

  removeAttribute(el: IDomItem, name: string, namespace?: string | null): void {
  }

  removeChild(parent: IDomItem, oldChild: IDomItem): void {
  }

  removeClass(el: IDomItem, name: string): void {
  }

  removeStyle(el: IDomItem, style: string, flags?: RendererStyleFlags2): void {
  }

  setAttribute(el: IDomItem, name: string, value: string, namespace?: string | null): void {
    if (name.startsWith('ng-')) {
      return;
    }

    el[name] = value;

    this.screen.delegateTagChanges(el);
  }

  setProperty(el: IDomItem, name: string, value: any): void {
    if (name === 'styles') {
      name = 'style';
    } else {
      el[name] = value;
    }

    this.screen.delegateTagChanges(el);
  }

  setStyle(el: IDomItem, attrName: string, value: any, flags?: RendererStyleFlags2): void {
    el.style = el.style || {};

    el.style[attrName] = value;

    this.screen.delegateTagChanges(el);
  }

  setValue(node: IDomItem, value: string): void {
    console.log('setContent', value);

    // node.setContent(value);
  }
}
