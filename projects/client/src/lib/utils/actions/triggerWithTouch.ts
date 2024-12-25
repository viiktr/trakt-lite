/**
 * This function is needed to handle touch events on iOS devices.
 * On iOS, touch events do not trigger click events by immediately in certain scenarios.
 * This utility ensures that a click event is triggered when a touch event ends,
 * providing a consistent user experience across different devices.
 */
export function triggerWithTouch(node: HTMLElement) {
  const handleTouchEnd = (event: PointerEvent) => {
    const isElement = event.target instanceof HTMLElement;
    if (!isElement) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.target.click();
  };

  node.addEventListener('pointerup', handleTouchEnd);

  return {
    destroy() {
      node.removeEventListener('pointerup', handleTouchEnd);
    },
  };
}
