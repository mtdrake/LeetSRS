import { RATING_BUTTONS, THEME_COLORS } from './constants';
import { getRatingColor, isDarkMode } from './theme';
import { createButton } from './button';

export type RatingCallback = (rating: number, label: string) => void;

export class RatingMenu {
  private element: HTMLDivElement | null = null;
  private container: HTMLElement;
  private onRate: RatingCallback;
  private onAddWithoutRating: () => void;

  constructor(container: HTMLElement, onRate: RatingCallback, onAddWithoutRating: () => void) {
    this.container = container;
    this.onRate = onRate;
    this.onAddWithoutRating = onAddWithoutRating;
  }

  toggle(): void {
    if (this.element) {
      this.hide();
    } else {
      this.show();
    }
  }

  show(): void {
    if (this.element) return;

    this.element = document.createElement('div');
    const isDark = isDarkMode();
    const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

    this.element.style.cssText = `
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      min-width: 160px;
      background-color: ${colors.bgSecondary};
      border: 1px solid ${colors.border};
      border-radius: 6px;
      padding: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 50;
    `;

    // Create rating buttons container
    const ratingButtonsContainer = document.createElement('div');
    ratingButtonsContainer.style.cssText = `
      display: flex;
      gap: 4px;
      margin-bottom: 8px;
    `;

    // Create rating buttons
    RATING_BUTTONS.forEach(({ rating, label, colorClass }) => {
      const { bg, hover } = getRatingColor(colorClass);

      const button = createButton({
        style: `
          width: 64px;
          padding: 6px 8px;
          border-radius: 4px;
          background-color: ${bg};
          color: white;
          font-size: 13px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        `,
        onClick: () => {
          this.onRate(rating, label);
          this.hide();
        },
      });

      button.textContent = label;

      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = hover;
      });
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = bg;
      });

      ratingButtonsContainer.appendChild(button);
    });

    this.element.appendChild(ratingButtonsContainer);

    // Add "Add without rating" button
    const addButton = this.createAddWithoutRatingButton();
    this.element.appendChild(addButton);

    // Add menu to container
    this.container.style.position = 'relative';
    this.container.appendChild(this.element);

    // Setup close on outside click
    setTimeout(() => {
      document.addEventListener('click', this.handleOutsideClick);
    }, 0);
  }

  private createAddWithoutRatingButton(): HTMLButtonElement {
    const isDark = isDarkMode();
    const bgColor = isDark ? THEME_COLORS.dark.bgButton : THEME_COLORS.light.bgSecondary;
    const hoverColor = isDark ? THEME_COLORS.dark.bgQuaternary : THEME_COLORS.light.bgTertiary;
    const textColor = isDark ? THEME_COLORS.dark.textSecondary : THEME_COLORS.light.textSecondary;

    const button = createButton({
      style: `
        width: 100%;
        padding: 6px 12px;
        border-radius: 4px;
        background-color: ${bgColor};
        color: ${textColor};
        font-size: 14px;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s;
        display: block;
      `,
      onClick: () => {
        this.onAddWithoutRating();
        this.hide();
      },
    });

    button.textContent = 'Add without rating';

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = hoverColor;
    });
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = bgColor;
    });

    return button;
  }

  hide(): void {
    if (this.element) {
      this.element.remove();
      this.element = null;
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }

  private handleOutsideClick = (e: MouseEvent): void => {
    if (!this.container.contains(e.target as Node)) {
      this.hide();
    }
  };
}
