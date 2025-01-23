import { useSpoiler } from './useSpoiler';

export function useSpoilerAction() {
  const { isSpoilerHidden } = useSpoiler();

  function spoiler(node: HTMLElement, isDisabled: boolean) {
    const add = () => {
      if (isDisabled) {
        return;
      }

      node.classList.add('trakt-spoiler');
    };

    const remove = () => {
      node.classList.remove('trakt-spoiler');
    };

    function applySpoilerStyle(isHidden: boolean, isDisabled: boolean) {
      if (isDisabled || !isHidden) {
        return remove();
      }

      (isHidden ? add : remove)();
    }

    const unsubscribe = isSpoilerHidden
      .subscribe((isHidden) => applySpoilerStyle(isHidden, isDisabled));

    return {
      destroy() {
        unsubscribe();
        node.classList.remove('trakt-spoiler');
      },
      update(isDisabled: boolean) {
        isSpoilerHidden.subscribe((isHidden) =>
          applySpoilerStyle(isHidden, isDisabled)
        )();
      },
    };
  }

  return {
    spoiler,
  };
}
