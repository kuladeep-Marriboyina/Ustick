import { Component } from '@angular/core';

@Component({
  selector: 'app-coming-soon',
  template: `
    <div class="coming-soon">
      <div class="emoji">🚧</div>
      <h2>Performance</h2>
      <p>Charts and topic-level trends land in the next pass.</p>
    </div>
  `,
  styles: [`
    .coming-soon { text-align: center; padding: 80px 20px; color: #7C8083; }
    .coming-soon .emoji { font-size: 48px; }
    .coming-soon h2 { margin: 12px 0 4px; color: #37474F; }
  `]
})
export class ComingSoonComponent {}
