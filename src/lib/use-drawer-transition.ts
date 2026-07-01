import { useEffect, useLayoutEffect, useState } from 'react';

interface DrawerTransitionState {
  rendered: boolean;
  visible: boolean;
}

/** Keeps drawer mounted through exit; double rAF ensures enter transition paints off-screen first. */
export function useDrawerTransition(open: boolean, panelTransitionMs: number): DrawerTransitionState {
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (open) {
      setRendered(true);
      setVisible(false);
      return;
    }

    setVisible(false);
  }, [open]);

  useEffect(() => {
    if (open) {
      let innerFrameId = 0;
      const outerFrameId = requestAnimationFrame(() => {
        innerFrameId = requestAnimationFrame(() => {
          setVisible(true);
        });
      });

      return () => {
        cancelAnimationFrame(outerFrameId);
        cancelAnimationFrame(innerFrameId);
      };
    }

    const timer = window.setTimeout(() => {
      setRendered(false);
    }, panelTransitionMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, panelTransitionMs]);

  return { rendered, visible };
}
