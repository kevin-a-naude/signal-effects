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

function handleException(e: unknown) {
  console.error(e);
}

function invokeEffect(e: Effect) {
  // Effects should not throw exceptions.
  //
  // Effects are run in varying contexts. If we permit them to throw exceptions,
  // we would extend the need for exception handling to every context in which
  // an effect may run. That is not practicable.
  try {
    return e.fn();
  } catch (e) {
    exceptionHandler(e);
  }
}

function propagateChange(s: AnySignal) {
  s.dependents.forEach(invokeEffect);
}

function propagateChanges(updatedSignals: AnySignal[]) {
  updatedSignals.forEach(propagateChange);
}

function releaseEffect(e: Effect) {
  // Unregister the effect's interest in its dependencies.
  for (const s of e.dependencies) {
    s.dependents.delete(e);
    e.dependencies.delete(s);
  }
}

/* Exported Functions */

let activeBatch: Set<AnySignal> | null = null;
let activeEffect: Effect | null = null;
let exceptionHandler: (e: unknown) => void = handleException;

export function setEffectExceptionHandler(handler: (e: unknown) => void) {
  exceptionHandler = handler;
}

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

export function effect(fn: () => void): Release {
  const theEffect = {
    fn,
    dependencies: new Set<AnySignal>(),
  };

  const ongoingEffect = activeEffect;
  activeEffect = theEffect;
  try {
    fn();
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
