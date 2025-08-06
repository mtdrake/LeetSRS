export default defineContentScript({
  matches: ['*://*.leetcode.com/*'],
  main() {
    // Wait for the navbar container to be available
    const waitForNavbar = setInterval(() => {
      const navbarContainer = document.getElementById('navbar-container');

      if (navbarContainer) {
        clearInterval(waitForNavbar);

        // Find the buttons container - it's not in navbar-container, search the whole document
        const buttonsContainer = document.querySelector('#ide-top-btns');

        if (buttonsContainer) {
          // Create wrapper structure matching the notes button exactly
          const buttonWrapper = document.createElement('div');
          buttonWrapper.className = 'relative flex';

          const innerWrapper = document.createElement('div');
          innerWrapper.className = 'relative flex overflow-hidden rounded bg-fill-tertiary dark:bg-fill-tertiary';

          const groupWrapper = document.createElement('div');
          groupWrapper.className =
            'group flex flex-none items-center justify-center hover:bg-fill-quaternary dark:hover:bg-fill-quaternary';

          const clickableDiv = document.createElement('div');
          clickableDiv.className = 'flex cursor-pointer p-2 text-gray-60 dark:text-gray-60';
          clickableDiv.setAttribute('data-state', 'closed');
          clickableDiv.setAttribute('title', 'LeetReps');
          clickableDiv.setAttribute('aria-label', 'LeetReps');

          clickableDiv.innerHTML = `
            <div class="relative text-[16px] leading-[normal] before:block before:h-4 before:w-4">
              <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" class="absolute left-1/2 top-1/2 h-[1em] -translate-x-1/2 -translate-y-1/2 align-[-0.125em]" role="img">
                <path d="M320 488c0 9.5-5.6 18.1-14.2 21.9s-18.8 2.3-25.8-4.1l-80-72c-5.1-4.6-7.9-11-7.9-17.8s2.9-13.3 7.9-17.8l80-72c7-6.3 17.2-7.9 25.8-4.1s14.2 12.4 14.2 21.9v40h16c35.3 0 64-28.7 64-64V153.3C371.7 141 352 112.8 352 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V320c0 70.7-57.3 128-128 128h-16v40zM456 80a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM192 24c0-9.5 5.6-18.1 14.2-21.9s18.8-2.3 25.8 4.1l80 72c5.1 4.6 7.9 11 7.9 17.8s-2.9 13.3-7.9 17.8l-80 72c-7 6.3-17.2 7.9-25.8 4.1s-14.2-12.4-14.2-21.9V128H176c-35.3 0-64 28.7-64 64V358.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V192c0-70.7 57.3-128 128-128h16V24zM56 432a24 24 0 1 0 48 0 24 24 0 1 0 -48 0z"/>
              </svg>
            </div>
          `;

          // Add click handler
          clickableDiv.addEventListener('click', () => {
            console.log('hey we made it!');
          });

          // Create custom tooltip functionality
          let tooltipTimeout;
          let customTooltip = null;

          const showTooltip = () => {
            // Create tooltip element
            customTooltip = document.createElement('div');
            customTooltip.className =
              'z-50 overflow-hidden rounded-md bg-layer-1 dark:bg-dark-layer-1 px-3 py-1.5 text-xs text-text-primary dark:text-text-primary shadow-md';
            customTooltip.style.position = 'fixed';
            customTooltip.style.pointerEvents = 'none';
            customTooltip.style.opacity = '0';
            customTooltip.style.transform = 'translateX(-50%) translateY(-4px) scale(0.95)';
            customTooltip.style.transition = 'all 100ms cubic-bezier(0.16, 1, 0.3, 1)';
            customTooltip.textContent = 'LeetReps';

            // Add border for dark mode
            if (document.documentElement.classList.contains('dark')) {
              customTooltip.style.backgroundColor = 'rgb(40, 40, 40)'; // Slightly lighter than page bg
              customTooltip.style.border = '1px solid rgba(255, 255, 255, 0.08)'; // Subtle white border
            }

            // Add data attributes for styling
            customTooltip.setAttribute('data-state', 'open');
            customTooltip.setAttribute('data-side', 'bottom');

            // Calculate position
            const rect = clickableDiv.getBoundingClientRect();
            customTooltip.style.top = `${rect.bottom + 8}px`;
            customTooltip.style.left = `${rect.left + rect.width / 2}px`;

            document.body.appendChild(customTooltip);

            // Trigger animation
            requestAnimationFrame(() => {
              customTooltip.style.opacity = '1';
              customTooltip.style.transform = 'translateX(-50%) translateY(0) scale(1)';
            });
          };

          const hideTooltip = () => {
            if (customTooltip) {
              customTooltip.remove();
              customTooltip = null;
            }
          };

          clickableDiv.addEventListener('mouseenter', () => {
            tooltipTimeout = setTimeout(showTooltip, 300); // Faster delay
          });

          clickableDiv.addEventListener('mouseleave', () => {
            clearTimeout(tooltipTimeout);
            hideTooltip();
          });

          groupWrapper.appendChild(clickableDiv);
          innerWrapper.appendChild(groupWrapper);
          buttonWrapper.appendChild(innerWrapper);

          // Insert before the last button group (the notes button)
          const lastButtonGroup = buttonsContainer.lastElementChild;

          try {
            buttonsContainer.insertBefore(buttonWrapper, lastButtonGroup);
          } catch (error) {
            console.error('Error adding button:', error);
          }
        }
      }
    }, 100);
  },
});
