import { useEffect, useLayoutEffect, useState } from 'react';

interface DrawerTransitionState {
  rendered: boolean;
  visible: boolean;
}

/** Keeps drawer mounted through exit; double rAF on enter/exit so transform transitions paint. */
export function useDrawerTransition(open: boolean, panelTransitionMs: number): DrawerTransitionState {
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (open) {
      setRendered(true);
      setVisible(false);
    }
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

    if (!rendered) {
      return;
    }

    let innerFrameId = 0;
    const outerFrameId = requestAnimationFrame(() => {
      innerFrameId = requestAnimationFrame(() => {
        setVisible(false);
      });
    });

    const timer = window.setTimeout(() => {
      setRendered(false);
    }, panelTransitionMs);

    return () => {
      cancelAnimationFrame(outerFrameId);
      cancelAnimationFrame(innerFrameId);
      window.clearTimeout(timer);
    };
  }, [open, panelTransitionMs, rendered]);

  return { rendered, visible };
}
