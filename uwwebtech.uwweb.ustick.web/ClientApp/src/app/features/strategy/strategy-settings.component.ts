import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { StrategyConfig } from '../../core/models/sticky-note.model';
import { StrategyService } from '../../services/strategy.service';

@Component({
  selector: 'app-strategy-settings',
  templateUrl: './strategy-settings.component.html',
  styleUrls: ['./strategy-settings.component.scss']
})
export class StrategySettingsComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }

  working!: StrategyConfig;
  intervalsText = '';
  thresholdPct = 75;

  constructor(public strategy: StrategyService) {}

  ngOnInit(): void {
    this.working = { ...this.strategy.current };
    this.intervalsText = this.working.strongIntervals.join(', ');
    this.thresholdPct = Math.round(this.working.strongThreshold * 100);
  }

  selectPreset(p: StrategyConfig): void {
    this.working = { ...p };
    this.intervalsText = this.working.strongIntervals.join(', ');
    this.thresholdPct = Math.round(this.working.strongThreshold * 100);
  }

  onThreshold(): void {
    this.working.strongThreshold = this.thresholdPct / 100;
    this.markCustom();
  }

  isSelected(p: StrategyConfig): boolean {
    return this.working.id === p.id;
  }

  get isCustom(): boolean {
    return this.working.id === 'custom';
  }

  markCustom(): void {
    this.working = { ...this.working, id: 'custom', name: 'Custom' };
  }

  onIntervals(value: string): void {
    const parsed = value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    this.working.strongIntervals = parsed.length ? parsed : [2, 4, 7];
    this.markCustom();
  }

  apply(): void {
    this.strategy.setStrategy(this.working);
    this.closed.emit();
  }
}
