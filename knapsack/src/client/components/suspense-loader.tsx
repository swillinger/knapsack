import React, { useState, useEffect, Suspense } from 'react';
import { CircleSpinner } from '@knapsack/design-system';

type Props = {
  delay?: number;
  children: React.ReactNode;
};

/**
 * Wrap a lazy loaded React Component with a spinner
 * Use instead of `<React.Suspense>`
 * @example
 * const MyThing = React.lazy(() => import('./my-thing'));
 * return (<SuspenseLoader><MyThing /></SuspenseLoader>)
 */
export const SuspenseLoader: React.FC<Props> = ({
  delay = 200,
  children,
}: Props) => {
  const [isSpinnerShown, setSpinnerShown] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setSpinnerShown(true);
    }, delay);
  }, []);
  return (
    <Suspense fallback={isSpinnerShown && <CircleSpinner />}>
      {children}
    </Suspense>
  );
};
