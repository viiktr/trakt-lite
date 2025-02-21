import { NOOP_FN } from '../constants.ts';
import { getMobileAppleDeviceType } from '../devices/getMobileAppleDeviceType.ts';

export function isMobileAppleDevice() {
  const deviceType = getMobileAppleDeviceType();

  return deviceType === 'iphone' || deviceType === 'ipad';
}

/**
 * This function is needed to handle touch events on mobile Apple devices.
 * On iOS & iPadOS, touch events do not trigger click events by immediately in certain scenarios.
 * This utility ensures that a click event is triggered when a touch event ends,
 * providing a consistent user experience across different devices.
 */
export function mobileAppleDeviceTriggerHack(
  node: HTMLElement,
  enabled = true,
) {
  // TODO(@seferturan): investigate why we need to disable for search items
  // relates to https://github.com/trakt/trakt-lite/issues/291
  if (!enabled) {
    return {
      destroy: NOOP_FN,
    };
  }

  const handleTouchEnd = (event: PointerEvent) => {
    const isMouse = event.pointerType === 'mouse';

    if (!isMobileAppleDevice() || isMouse) {
      return;
    }

    const isElement = event.target instanceof HTMLElement;
    if (!isElement) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    //TODO why?
    // event.target.click();
  };

  node.addEventListener('pointerup', handleTouchEnd);

  return {
    destroy() {
      node.removeEventListener('pointerup', handleTouchEnd);
    },
  };
}
