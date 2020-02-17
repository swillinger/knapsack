import { useEffect, useState, useRef } from 'react';
import shortid from 'shortid';
import deepEqual from 'deep-equal';

/**
 * Creates a duplicate internal state, so we can preserve instant value editing while debouncing top-level state updates that are slow
 * Warning: passing `{}` as `globalVal` will cause infinite loop since `{} !== {}` (use in `useEffect` dependency array)
 * Borrowed with appreciation from `react-view`
 * @example
 * const [code, setCode] = useValueDebounce<string>(globalCode, handleChange);
 */
export function useValueDebounce<T>(
  globalVal: T,
  globalSet: (val: T) => void,
  /**
   * ms to delay
   */
  delay = 250,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [val, set] = useState(globalVal);

  useEffect(() => {
    // begins a countdown when 'val' changes. if it changes before countdown
    // ends, clear the timeout avoids lodash debounce to avoid stale
    // values in globalSet.
    const isEqual =
      typeof globalVal === 'string'
        ? val === globalVal
        : deepEqual(val, globalVal);

    if (!isEqual) {
      const timeout = setTimeout(() => globalSet(val), delay);
      return () => clearTimeout(timeout);
    }
    // return void 0;
  }, [val]);

  useEffect(() => {
    set(globalVal);
  }, [globalVal]);

  return [val, set];
}

/**
 * @example
 * const [hoverRef, isHover] = useHover();
 * <div ref={hoverRef as any}>when hovered, `isHover` is true
 * Borrowed with appreciation from `react-view`
 */
export function useHover(
  /**
   * Optionally takes an already created ref to re-use
   */
  prevRef?: React.MutableRefObject<HTMLElement>,
): [React.MutableRefObject<HTMLElement>, boolean] {
  const [value, setValue] = useState<boolean>(false);
  const ref = prevRef ?? useRef(null);
  const handleMouseEnter = () => setValue(true);
  const handleMouseLeave = () => setValue(false);
  useEffect(() => {
    const node = ref.current as any;
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
    return undefined;
  }, [ref.current]);
  return [ref, value];
}

/**
 * Generate a unique ID that won't change between renders.
 * Useful for forms
 */
export const useFallbackId = (prefix = 'ks-fallback-id') => {
  return useRef(`${prefix}--${shortid()}`).current;
};
