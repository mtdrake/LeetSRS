import { createLeetRepsButton, RatingMenu, Tooltip } from './content-utils';

export default defineContentScript({
  matches: ['*://*.leetcode.com/*'],
  main() {
    setupLeetRepsButton();
  },
});

function setupLeetRepsButton() {
  // Wait for the navbar container to be available
  const checkInterval = setInterval(() => {
    const navbarContainer = document.getElementById('navbar-container');

    if (navbarContainer) {
      clearInterval(checkInterval);

      // Find the buttons container
      const buttonsContainer = document.querySelector('#ide-top-btns');

      if (buttonsContainer) {
        // Create the button and its functionality
        const tooltip = new Tooltip();
        let ratingMenu: RatingMenu | null = null;

        const buttonWrapper = createLeetRepsButton(() => {
          if (ratingMenu) {
            ratingMenu.toggle();
          }
        });

        // Setup rating menu
        ratingMenu = new RatingMenu(
          buttonWrapper,
          (rating, label) => {
            console.log(`Rated: ${label} (${rating})`);
            // TODO: Send message to background script to save the rating
          },
          () => {
            console.log('Add without rating clicked');
            // TODO: Send message to background script to add without rating
          }
        );

        // Setup tooltip
        const clickableDiv = buttonWrapper.querySelector('[data-state="closed"]') as HTMLElement;
        if (clickableDiv) {
          clickableDiv.addEventListener('mouseenter', () => {
            tooltip.show(clickableDiv, 'LeetReps');
          });

          clickableDiv.addEventListener('mouseleave', () => {
            tooltip.hide();
          });
        }

        // Insert before the last button group (the notes button)
        const lastButtonGroup = buttonsContainer.lastElementChild;

        try {
          buttonsContainer.insertBefore(buttonWrapper, lastButtonGroup);
        } catch (error) {
          console.error('Error adding LeetReps button:', error);
        }
      }
    }
  }, 100);
}
