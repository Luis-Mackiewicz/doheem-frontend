import { Component } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-group-layout',
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex min-h-dvh bg-page transition-colors duration-150">
      <app-sidebar [groupId]="groupId" />
      <main class="flex-1 lg:ml-64 pt-14 lg:pt-6 pb-16 lg:pb-0 p-6 md:p-8 lg:p-10 transition-colors duration-150">
        <router-outlet />
      </main>
    </div>
  `,
})
export class GroupLayoutComponent {
  protected groupId: string;

  constructor(route: ActivatedRoute) {
    this.groupId = route.snapshot.paramMap.get('id') ?? '';
  }
}
