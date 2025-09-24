import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-actions',
  imports: [],
  template: `<p class="text-white">user-actions works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActionsComponent { }
