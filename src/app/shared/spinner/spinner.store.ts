// spinner.store.ts
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface LoadingState {
  active: number;
  isLoading: boolean;
}

@Injectable({ providedIn: 'root' })
export class Store extends ComponentStore<LoadingState> {
  // Tiempos
  private showDelayMs = 150;  // espera antes de mostrar
  private minVisibleMs = 300; // mínimo visible
  private graceMs = 120;      // ventana de gracia para encadenar requests

  // Timers
  private showTimer: any = null;
  private hideTimer: any = null;
  private visibleSince: number | null = null;

  constructor() {
    super({ active: 0, isLoading: false });
  }

  readonly isLoading$ = this.select(s => s.isLoading);

  private readonly setIsLoading = this.updater<boolean>((s, isLoading) => ({
    ...s, isLoading,
  }));

  private readonly incActive = this.updater(s => ({ ...s, active: s.active + 1 }));
  private readonly decActive = this.updater(s => ({ ...s, active: Math.max(0, s.active - 1) }));

  requestStarted() {
    // Si había un hide programado, lo cancelamos (entra otra request)
    this.clearHideTimer();

    this.incActive();
    const { active } = this.get();

    if (active === 1) {
      // primera request: programar el show con delay (anti flicker)
      this.clearShowTimer();
      this.showTimer = setTimeout(() => {
        this.setIsLoading(true);
        this.visibleSince = Date.now();
      }, this.showDelayMs);
    }
  }

  requestEnded() {
    this.decActive();
    const { active } = this.get();

    if (active === 0) {
      const hide = () => {
        this.setIsLoading(false);
        this.visibleSince = null;
      };

      // Si aún no se mostró, cancelamos el show pendiente y ocultamos sin más
      if (!this.visibleSince) {
        this.clearShowTimer();
        hide();
        return;
      }

      // Respetar mínimo visible + ventana de gracia
      const elapsed = Date.now() - this.visibleSince;
      const remainingMinVisible = Math.max(this.minVisibleMs - elapsed, 0);
      const wait = Math.max(remainingMinVisible, this.graceMs);

      this.clearHideTimer();
      this.hideTimer = setTimeout(() => {
        // Si durante la espera entró otra request, no ocultamos
        if (this.get().active === 0) hide();
      }, wait);
    }
  }

  private clearShowTimer() {
    if (this.showTimer) { clearTimeout(this.showTimer); this.showTimer = null; }
  }
  private clearHideTimer() {
    if (this.hideTimer) { clearTimeout(this.hideTimer); this.hideTimer = null; }
  }
}
