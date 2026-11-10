import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StickyNote, WallResponse } from '../../core/models/sticky-note.model';

/**
 * Real API calls to the UStick .NET backend. Wired but not used until the facade
 * (StickyNoteService) flips useMock -> false.
 */
@Injectable({ providedIn: 'root' })
export class StickyNoteHttpService {
  private readonly base = `${environment.apiBaseUrl}/stickynote`;

  constructor(private http: HttpClient) {}

  getWall(userId: number): Observable<WallResponse> {
    return this.http.get<WallResponse>(`${this.base}/wall/${userId}`);
  }

  getPeelParty(userId: number, count: number): Observable<StickyNote[]> {
    return this.http.get<StickyNote[]>(`${this.base}/peel-party/${userId}?count=${count}`);
  }

  saveCustomNote(stickyNoteId: number, customNote: string): Observable<{ saved: boolean }> {
    return this.http.post<{ saved: boolean }>(`${this.base}/${stickyNoteId}/custom-note`, { customNote });
  }
}
