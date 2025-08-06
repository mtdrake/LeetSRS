import { createLeetRepsButton, extractProblemData, RatingMenu, Tooltip } from '@/utils/content';
import { sendMessage, MessageType } from '@/shared/messages';
import type { Grade } from 'ts-fsrs';

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
          async (rating, label) => {
            const problemData = extractProblemData();
            if (!problemData) {
              console.error('Could not extract problem data');
              return;
            }

            try {
              const result = await sendMessage({
                type: MessageType.RATE_CARD,
                slug: problemData.titleSlug,
                name: problemData.title,
                rating: rating as Grade,
                leetcodeId: problemData.questionFrontendId,
                difficulty: problemData.difficulty,
              });
              console.log(`${label} - Card rated:`, result);
            } catch (error) {
              console.error('Error rating card:', error);
            }
          },
          async () => {
            const problemData = extractProblemData();
            if (!problemData) {
              console.error('Could not extract problem data');
              return;
            }

            try {
              const result = await sendMessage({
                type: MessageType.ADD_CARD,
                slug: problemData.titleSlug,
                name: problemData.title,
                leetcodeId: problemData.questionFrontendId,
                difficulty: problemData.difficulty,
              });
              console.log('Add without rating - Card added:', result);
            } catch (error) {
              console.error('Error adding card:', error);
            }
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
