export function createButton(options: {
  className?: string;
  style?: string;
  innerHTML?: string;
  onClick?: () => void;
}): HTMLButtonElement {
  const button = document.createElement('button');

  if (options.className) {
    button.className = options.className;
  }

  if (options.style) {
    button.style.cssText = options.style;
  }

  if (options.innerHTML) {
    button.innerHTML = options.innerHTML;
  }

  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }

  return button;
}

export function createLeetRepsButton(onClick: () => void): HTMLDivElement {
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

  clickableDiv.addEventListener('click', onClick);

  groupWrapper.appendChild(clickableDiv);
  innerWrapper.appendChild(groupWrapper);
  buttonWrapper.appendChild(innerWrapper);

  return buttonWrapper;
}
