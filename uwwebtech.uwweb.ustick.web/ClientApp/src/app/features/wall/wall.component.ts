import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import {
  DEMO_USER, StickyNote, StickyState, WallResponse, isDue, stateForMastery
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
  peelingIds = new Set<number>();

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

  /** All topics still on the wall, as one grid sorted weakest-first. */
  get activeNotes(): StickyNote[] {
    if (!this.wall) { return []; }
    return this.wall.columns
      .filter(c => c.state !== StickyState.Peeled)
      .reduce((all, c) => all.concat(c.notes), [] as StickyNote[])
      .sort((a, b) => a.state - b.state || a.mastery - b.mastery);
  }

  get fameNotes(): StickyNote[] {
    const fame = this.wall?.columns.find(c => c.state === StickyState.Peeled);
    return fame ? fame.notes : [];
  }

  get dueCount(): number {
    return this.activeNotes.filter(n => isDue(n.dueDate, this.now)).length;
  }

  isPeeling(note: StickyNote): boolean {
    return this.peelingIds.has(note.stickyNoteId);
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
    note.lastTestedDate = this.now.toISOString();

    if (result.mastered) {
      // play the peel-off in place, then move the card to Mastered
      this.peelingIds.add(note.stickyNoteId);
      setTimeout(() => {
        note.state = StickyState.Peeled;
        note.dueDate = null;
        note.peeledDate = this.now.toISOString();
        this.relocate(note, prevState);
        this.peelingIds.delete(note.stickyNoteId);
        this.justGraduated = note;
        setTimeout(() => (this.justGraduated = undefined), 2800);
      }, 1050);
      return;
    }

    // not mastered: update stage + schedule the next spaced retest
    note.state = stateForMastery(result.newMastery);
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
