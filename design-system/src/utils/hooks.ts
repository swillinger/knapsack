import { useEffect, useState, useRef } from 'react';

/**
 * Creates a duplicate internal state, so we can preserve instant value editing while debouncing top-level state updates that are slow
 * @param globalVal
 * @param globalSet
 * @example
 * const [code, setCode] = useValueDebounce<string>(globalCode, handleChange);
 */
export function useValueDebounce<T>(
  globalVal: T,
  globalSet: (val: T) => void,
): [T, (val: T) => void] {
  const [val, set] = useState(globalVal);

  useEffect(() => {
    // begins a countdown when 'val' changes. if it changes before countdown
    // ends, clear the timeout avoids lodash debounce to avoid stale
    // values in globalSet.
    if (val !== globalVal) {
      const timeout = setTimeout(() => globalSet(val), 250);
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
 */
export function useHover() {
  const [value, setValue] = useState<boolean>(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(() => {
    const node = ref.current as any;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
    return undefined;
  }, [ref.current]);
  return [ref, value];
}
