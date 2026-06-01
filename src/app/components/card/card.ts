import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div [class]="'w-full rounded-xl bg-card border-theme shadow-2xl p-8 md:p-10 flex flex-col ' + customClass">
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  @Input() customClass = '';
}
