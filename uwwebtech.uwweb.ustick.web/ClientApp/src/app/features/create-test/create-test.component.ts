import { Component } from '@angular/core';
import { MOCK_NOTES } from '../../services/mock/sticky-note.mock';

interface SubjectRow {
  name: string;
  count: number;
  selected: boolean;
}

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent {
  mode: 'standard' | 'custom' = 'standard';

  modes = [
    { key: 'unused', label: 'Unused', count: 3968, selected: true },
    { key: 'incorrect', label: 'Incorrect', count: 0, selected: false },
    { key: 'marked', label: 'Marked', count: 0, selected: false },
    { key: 'omitted', label: 'Omitted', count: 0, selected: false },
    { key: 'correct', label: 'Correct', count: 0, selected: false }
  ];

  subjects: SubjectRow[] = Array.from(
    new Map(MOCK_NOTES.map(n => [n.subjectName, n])).values()
  ).map(n => ({ name: n.subjectName, count: 300 + (n.topicId * 37) % 260, selected: false }));

  questionCount = 0;

  toggleSubject(row: SubjectRow): void {
    row.selected = !row.selected;
  }

  get canGenerate(): boolean {
    return this.questionCount > 0 && this.subjects.some(s => s.selected);
  }
}
