import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

@Component({
  selector: 'app-pixi',
  template: 'some text',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PIXIComponent {}
