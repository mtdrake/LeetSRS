import { isDarkMode } from './theme';

export class Tooltip {
  private element: HTMLDivElement | null = null;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  show(target: HTMLElement, text: string, delay = 300): void {
    this.hide();

    this.timeout = setTimeout(() => {
      this.element = document.createElement('div');
      this.element.className = 'z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs shadow-md';
      this.element.style.cssText = `
        position: fixed;
        pointer-events: none;
        opacity: 0;
        transform: translateX(-50%) translateY(-4px) scale(0.95);
        transition: all 100ms cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 50;
      `;

      // Set colors based on theme
      if (isDarkMode()) {
        this.element.style.backgroundColor = 'rgb(40, 40, 40)';
        this.element.style.border = '1px solid rgba(255, 255, 255, 0.08)';
        this.element.style.color = '#e5e7eb';
      } else {
        this.element.style.backgroundColor = 'white';
        this.element.style.border = '1px solid rgba(0, 0, 0, 0.08)';
        this.element.style.color = '#374151';
      }

      this.element.textContent = text;

      // Calculate position
      const rect = target.getBoundingClientRect();
      this.element.style.top = `${rect.bottom + 8}px`;
      this.element.style.left = `${rect.left + rect.width / 2}px`;

      document.body.appendChild(this.element);

      // Trigger animation
      requestAnimationFrame(() => {
        if (this.element) {
          this.element.style.opacity = '1';
          this.element.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        }
      });
    }, delay);
  }

  hide(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
