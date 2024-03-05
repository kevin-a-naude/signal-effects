/* Exported Types */

export interface Signal<T> {
  get value(): T;
  set value(newValue: T);
}

/* Internal Types */

interface AnySignal {
  dependents: Set<Effect>;
}

interface Effect {
  fn: () => void;

  dependencies: Set<AnySignal>;
}

type Release = () => void;
type EqualityComparator<T> = (oldValue: T, newValue: T) => boolean;

/* Supporting Functions */

function propagateChange(s: AnySignal) {
  s.dependents.forEach((effect) => effect.fn());
}

function propagateChanges(updatedSignals: AnySignal[]) {
  updatedSignals.forEach((signal) => propagateChange(signal));
}

function releaseEffect(e: Effect) {
  e.dependencies.forEach((s) => decoupleSignalEffect(s, e));
}

function decoupleSignalEffect(s: AnySignal, e: Effect) {
  s.dependents.delete(e);
  e.dependencies.delete(s);
}

/* Exported Functions */

let activeBatch: Set<AnySignal> | null = null;
let activeEffect: Effect | null = null;

export function batch<R = void>(fn: () => R): R {
  if (activeBatch) return fn();

  activeBatch = new Set<AnySignal>();
  try {
    return fn();
  } finally {
    const updatedSignals = [...activeBatch];
    activeBatch = null;
    propagateChanges(updatedSignals);
  }
}

export function effect(
  fn: () => void,
  errorHandler?: (e: unknown) => void
): Release {
  const safeFn = () => {
    try {
      fn();
    } catch (e) {
      errorHandler?.(e);
    }
  };
  const theEffect = {
    fn: safeFn,
    dependencies: new Set<AnySignal>(),
  };

  const ongoingEffect = activeEffect;
  activeEffect = theEffect;
  try {
    theEffect.fn();
  } catch (e) {
    releaseEffect(theEffect);
    throw e;
  } finally {
    activeEffect = ongoingEffect;
  }

  return () => releaseEffect(theEffect);
}

export function signal<T>(
  initialValue: T,
  equals?: EqualityComparator<T>
): Signal<T> {
  let theValue = initialValue;

  const theSignal: Signal<T> & AnySignal = {
    get value(): T {
      const effect = activeEffect;
      if (effect && !theSignal.dependents.has(effect)) {
        theSignal.dependents.add(effect);
        effect.dependencies.add(theSignal);
      }
      return theValue;
    },

    set value(newValue: T) {
      if (theValue !== newValue && (!equals || !equals(theValue, newValue))) {
        theValue = newValue;
        if (activeBatch) activeBatch.add(theSignal);
        else propagateChange(theSignal);
      }
    },

    dependents: new Set<Effect>(),
  };

  return theSignal;
}
