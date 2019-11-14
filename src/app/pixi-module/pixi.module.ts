import {ModuleWithProviders, NgModule, NgZone, NO_ERRORS_SCHEMA, RendererFactory2} from '@angular/core';
import { CommonModule } from '@angular/common';
import {StageComponent} from './stage.component';
import {PixiRendererFactory} from './PixiRenderingFactory';
import {PIXIScreen} from './PIXIScreen';
import {PIXIComponent} from './pixi.component';
import {ɵDomRendererFactory2 as DomRendererFactory2} from '@angular/platform-browser';

function instantiateRendererFactory(
  renderer: DomRendererFactory2, screen: PIXIScreen, zone: NgZone) {
  return new PixiRendererFactory(renderer, screen, zone);
}

@NgModule({
  exports: [StageComponent],
  declarations: [StageComponent, PIXIComponent],
  imports: [
    CommonModule
  ],
  providers: [
    PIXIScreen,
    {
      provide: RendererFactory2,
      useFactory: instantiateRendererFactory,
      deps: [DomRendererFactory2, PIXIScreen, NgZone]
    }
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class PIXIModule {}
