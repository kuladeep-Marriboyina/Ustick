import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import {
  DEMO_USER, StickyNote, StickyState, WallColumn, WallResponse, stateForMastery
} from '../../core/models/sticky-note.model';
import { StickyNoteService } from '../../services/sticky-note.service';
import { ClockService } from '../../services/clock.service';
import { StrategyService } from '../../services/strategy.service';
import { RetestResult } from './retest/retest-dialog.component';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss']
})
export class WallComponent implements OnInit {
  wall?: WallResponse;
  loading = true;
  user = DEMO_USER;
  activeTab: 'wall' | 'fame' = 'wall';
  now: Date = new Date();

  activeTopic?: StickyNote;
  justGraduated?: StickyNote;
  showStrategy = false;

  constructor(
    private stickyNoteService: StickyNoteService,
    private clock: ClockService,
    public strategy: StrategyService
  ) {}

  ngOnInit(): void {
    this.clock.watch().subscribe(d => (this.now = d));
    this.stickyNoteService
      .getWall(this.user.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(wall => (this.wall = wall));
  }

  get activeColumns(): WallColumn[] {
    return this.wall ? this.wall.columns.filter(c => c.state !== StickyState.Peeled) : [];
  }

  get fameNotes(): StickyNote[] {
    const fame = this.wall?.columns.find(c => c.state === StickyState.Peeled);
    return fame ? fame.notes : [];
  }

  get dueCount(): number {
    return this.activeColumns
      .reduce((s, c) => s + c.notes.filter(n => !n.dueDate || new Date(n.dueDate) <= this.now).length, 0);
  }

  simulateDay(): void {
    this.clock.advanceDays(1);
  }

  openRetest(note: StickyNote): void {
    this.activeTopic = note;
  }

  onRetestClosed(result: RetestResult): void {
    this.activeTopic = undefined;
    if (!this.wall) { return; }

    const note = result.note;
    const prevState = note.state;
    note.mastery = result.newMastery;
    note.accuracyPct = result.newMastery;
    note.state = stateForMastery(result.newMastery);
    note.lastTestedDate = this.now.toISOString();

    if (result.mastered) {
      note.dueDate = null;
      note.peeledDate = this.now.toISOString();
      this.justGraduated = note;
      setTimeout(() => (this.justGraduated = undefined), 2800);
    } else {
      // schedule the next spaced retest
      let cooldown: number;
      if (result.strong) {
        note.strongStreak += 1;
        cooldown = this.strategy.cooldownAfterStrong(note.strongStreak);
      } else {
        note.strongStreak = 0;
        cooldown = this.strategy.current.weakInterval;
      }
      const due = new Date(this.now);
      due.setDate(due.getDate() + cooldown);
      note.dueDate = due.toISOString();
    }

    if (note.state !== prevState) { this.relocate(note, prevState); }
  }

  private relocate(note: StickyNote, fromState: StickyState): void {
    if (!this.wall) { return; }
    const from = this.wall.columns.find(c => c.state === fromState);
    const to = this.wall.columns.find(c => c.state === note.state);
    if (from) { from.notes = from.notes.filter(n => n !== note); }
    if (to) { to.notes = [...to.notes, note].sort((a, b) => a.mastery - b.mastery); }

    this.wall.stuckCount = this.wall.columns
      .filter(c => c.state !== StickyState.Peeled)
      .reduce((s, c) => s + c.notes.length, 0);
    const fame = this.wall.columns.find(c => c.state === StickyState.Peeled);
    this.wall.peeledCount = fame ? fame.notes.length : 0;
  }
}
