import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Demo clock. Spaced repetition plays out over days, so this lets the user
 * fast-forward time to watch the loop instead of waiting for real days.
 * Starts on the mock data's reference date.
 */
@Injectable({ providedIn: 'root' })
export class ClockService {
  private readonly now$ = new BehaviorSubject<Date>(new Date('2026-11-10T09:00:00'));

  get now(): Date {
    return this.now$.value;
  }

  watch(): Observable<Date> {
    return this.now$.asObservable();
  }

  advanceDays(days: number): void {
    const next = new Date(this.now$.value);
    next.setDate(next.getDate() + days);
    this.now$.next(next);
  }
}
