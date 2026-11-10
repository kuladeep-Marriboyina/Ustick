import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { StickyNote, StickyState, TopicQuestion, WallResponse } from '../core/models/sticky-note.model';
import { StickyNoteHttpService } from './http/sticky-note.httpservice';
import { buildMockWall, MOCK_NOTES, TOPIC_QUESTIONS } from './mock/sticky-note.mock';

/**
 * Facade the components talk to. This foundation pass serves mock data; flip
 * `useMock` to false to run against the live .NET API (one-line change).
 */
@Injectable({ providedIn: 'root' })
export class StickyNoteService {
  private useMock = true;

  constructor(private http: StickyNoteHttpService) {}

  getWall(userId: number): Observable<WallResponse> {
    if (this.useMock) {
      return of(buildMockWall(userId)).pipe(delay(250));
    }
    return this.http.getWall(userId);
  }

  getPeelParty(userId: number, count: number): Observable<StickyNote[]> {
    if (this.useMock) {
      return of(
        MOCK_NOTES
          .filter(n => n.state !== StickyState.Peeled)
          .sort((a, b) => b.stickiness - a.stickiness)
          .slice(0, count)
      ).pipe(delay(200));
    }
    return this.http.getPeelParty(userId, count);
  }

  /** Same-concept questions used to retest a weak topic. */
  getQuestions(topicId: number): Observable<TopicQuestion[]> {
    if (this.useMock) {
      return of(TOPIC_QUESTIONS[topicId] || []).pipe(delay(200));
    }
    // Backend endpoint lands in the next pass; fall back to mock for now.
    return of(TOPIC_QUESTIONS[topicId] || []);
  }

  saveCustomNote(stickyNoteId: number, customNote: string): Observable<boolean> {
    if (this.useMock) {
      return of(true).pipe(delay(150));
    }
    return this.http.saveCustomNote(stickyNoteId, customNote).pipe(map(r => r.saved));
  }
}
