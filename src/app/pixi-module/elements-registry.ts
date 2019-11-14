import * as PIXI from 'pixi.js';

export type ElementFactory = (...params: any[]) => PIXI.DisplayObject;

export const elementsFactory: Map<string, ElementFactory> = new Map()
  .set('text', (...props) => new (PIXI.Text as any)(...props))
  .set('sprite', PIXI.Sprite);
