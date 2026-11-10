import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DEFAULT_STRATEGY, StrategyConfig, STRATEGY_PRESETS } from '../core/models/sticky-note.model';

/**
 * Holds the learner's chosen spaced-repetition strategy. Defaults to the
 * evidence-based "Proven" preset; the learner can switch preset or go custom.
 */
@Injectable({ providedIn: 'root' })
export class StrategyService {
  private readonly current$ = new BehaviorSubject<StrategyConfig>({ ...DEFAULT_STRATEGY });

  readonly presets = STRATEGY_PRESETS;

  get current(): StrategyConfig {
    return this.current$.value;
  }

  watch(): Observable<StrategyConfig> {
    return this.current$.asObservable();
  }

  setStrategy(config: StrategyConfig): void {
    this.current$.next({ ...config });
  }

  /** Cooldown in days after a pass, given how many strong passes are now banked. */
  cooldownAfterStrong(strongStreak: number): number {
    const iv = this.current.strongIntervals;
    const i = Math.min(Math.max(strongStreak - 1, 0), iv.length - 1);
    return iv[i];
  }
}
