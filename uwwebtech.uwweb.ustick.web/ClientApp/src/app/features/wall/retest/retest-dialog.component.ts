import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StickyNote, TopicQuestion } from '../../../core/models/sticky-note.model';
import { StickyNoteService } from '../../../services/sticky-note.service';
import { StrategyService } from '../../../services/strategy.service';

export interface RetestResult {
  note: StickyNote;
  newMastery: number;
  mastered: boolean;
  strong: boolean;
}

type Mode = 'loading' | 'question' | 'feedback' | 'summary';

const MASTERY_FLOOR = 10;  // mastery never drops below this

@Component({
  selector: 'app-retest-dialog',
  templateUrl: './retest-dialog.component.html',
  styleUrls: ['./retest-dialog.component.scss']
})
export class RetestDialogComponent implements OnInit {
  @Input() note!: StickyNote;
  @Output() closed = new EventEmitter<RetestResult>();

  mode: Mode = 'loading';
  questions: TopicQuestion[] = [];
  index = 0;
  selectedKey: string | null = null;
  correctCount = 0;
  wrongCount = 0;

  startMastery = 0;

  readonly circumference = 2 * Math.PI * 20;

  constructor(private service: StickyNoteService, private strategy: StrategyService) {}

  ngOnInit(): void {
    this.startMastery = this.note.mastery;
    this.service.getQuestions(this.note.topicId).subscribe(qs => {
      this.questions = qs;
      this.mode = qs.length ? 'question' : 'summary';
    });
  }

  get current(): TopicQuestion {
    return this.questions[this.index];
  }

  get total(): number {
    return this.questions.length || 1;
  }

  /** What a single correct answer is worth, for the feedback chip. */
  get perCorrect(): number {
    return Math.round(this.strategy.current.gainCap / this.total);
  }

  /** Can this topic possibly graduate this session? Only if it starts high enough. */
  get canGraduate(): boolean {
    return this.startMastery >= this.strategy.current.gradFloor;
  }

  /** Live mastery: strong answers lift it, wrong answers pull it back; capped per attempt. */
  get liveMastery(): number {
    const cfg = this.strategy.current;
    const gain = Math.round(
      cfg.gainCap * (this.correctCount / this.total) - cfg.penalty * (this.wrongCount / this.total)
    );
    const ceil = this.canGraduate ? 100 : 99;
    return Math.max(MASTERY_FLOOR, Math.min(ceil, this.startMastery + gain));
  }

  get mastered(): boolean {
    return this.liveMastery >= 100;
  }

  /** A strong pass advances the spaced schedule; a weak one resets it. */
  get strong(): boolean {
    return this.correctCount / this.total >= this.strategy.current.strongThreshold;
  }

  get delta(): number {
    return this.liveMastery - this.startMastery;
  }

  /** Days until this topic unlocks for its next retest, under the current strategy. */
  get nextCooldownDays(): number {
    if (this.mastered) { return 0; }
    return this.strong
      ? this.strategy.cooldownAfterStrong(this.note.strongStreak + 1)
      : this.strategy.current.weakInterval;
  }

  get dashOffset(): number {
    return this.circumference * (1 - this.liveMastery / 100);
  }

  get lastCorrect(): boolean {
    return this.selectedKey === this.current?.correctKey;
  }

  select(key: string): void {
    if (this.mode !== 'question') { return; }
    this.selectedKey = key;
    if (key === this.current.correctKey) { this.correctCount += 1; } else { this.wrongCount += 1; }
    this.mode = 'feedback';
  }

  next(): void {
    if (this.index < this.questions.length - 1) {
      this.index += 1;
      this.selectedKey = null;
      this.mode = 'question';
    } else {
      this.mode = 'summary';
    }
  }

  finish(): void {
    this.closed.emit({
      note: this.note,
      newMastery: this.liveMastery,
      mastered: this.mastered,
      strong: this.strong
    });
  }

  optionClass(key: string): string {
    if (this.mode === 'question') {
      return this.selectedKey === key ? 'is-picked' : '';
    }
    if (key === this.current.correctKey) { return 'is-correct'; }
    if (key === this.selectedKey) { return 'is-wrong'; }
    return 'is-dim';
  }
}
