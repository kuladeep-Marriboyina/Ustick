import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  daysUntil, isDue, StageMeta, STAGE_META, StickyNote, StickyState
} from '../../../core/models/sticky-note.model';

@Component({
  selector: 'app-topic-card',
  templateUrl: './topic-card.component.html',
  styleUrls: ['./topic-card.component.scss']
})
export class TopicCardComponent {
  @Input() note!: StickyNote;
  @Input() now: Date = new Date();
  /** When true the card plays its peel-off animation (just mastered). */
  @Input() peeling = false;
  @Output() retest = new EventEmitter<StickyNote>();

  readonly ringRadius = 26;
  readonly circumference = 2 * Math.PI * 26;

  get meta(): StageMeta {
    return STAGE_META[this.note.state];
  }

  get stageKey(): string {
    switch (this.note.state) {
      case StickyState.StuckHard: return 'weak';
      case StickyState.Peeling: return 'improve';
      case StickyState.AlmostGone: return 'almost';
      case StickyState.Peeled: return 'master';
      default: return 'weak';
    }
  }

  get isMastered(): boolean {
    return this.note.state === StickyState.Peeled;
  }

  get due(): boolean {
    return isDue(this.note.dueDate, this.now);
  }

  get daysLeft(): number {
    return daysUntil(this.note.dueDate, this.now);
  }

  get dashOffset(): number {
    const pct = Math.max(0, Math.min(100, this.note.mastery));
    return this.circumference * (1 - pct / 100);
  }

  onRetest(): void {
    if (this.due && !this.isMastered) { this.retest.emit(this.note); }
  }
}
