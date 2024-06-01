import { assert, describe, test } from 'vitest';

import { batch, effect, signal } from '../src';

describe('signal behaviour', () => {
  test('signal value is mutable', () => {
    const s = signal(123);
    assert.equal(s.value, 123);
    s.value++;
    assert.equal(s.value, 124);
  });
});

describe('effect behaviour', () => {
  test('signals propagate to dependent effects', () => {
    const s = signal(1);

    let effectObserved = false;
    const releaseE = effect(() => (effectObserved = s.value > 1));

    s.value++;

    assert.isTrue(effectObserved, 'an effect should be observed');

    releaseE();
  });

  test('signals do not propagate to independent effects', () => {
    const s = signal(1);

    let effectObserved = false;
    const releaseE = effect(() => (effectObserved = true));
    effectObserved = false; // <-- ignore initial run of effect

    s.value++;

    assert.isFalse(effectObserved, 'an effect should not be observed');

    releaseE();
  });

  test('signals do not propagate to unrelated effects', () => {
    const s1 = signal(1);
    const s2 = signal(2);

    let valueObserved = 0;
    const releaseE = effect(() => (valueObserved = s1.value));

    s2.value++;

    assert.notEqual(valueObserved, 0, 'an effect should not be observed');

    releaseE();
  });

  test('secondary effects should propagate', () => {
    const s1 = signal(1);
    const s2 = signal(0);

    let valueObserved = 0;
    const releaseE1 = effect(() => (s2.value = s1.value));
    const releaseE2 = effect(() => (valueObserved = s2.value));

    s1.value++;

    assert.equal(
      valueObserved,
      2,
      'value should propagate through dependent effects'
    );

    releaseE1();
    releaseE2();
  });
});

describe('batch behaviour', () => {
  test('without a batch, signal values can change surprisingly due to external effects', () => {
    const s1 = signal(2);
    const s2 = signal(0);

    const releaseE = effect(() => (s1.value = s2.value));

    s1.value = 0;
    s2.value = 1;
    const valueObserved = s1.value;

    assert.equal(valueObserved, 1, 'surprising behaviour should occur');

    releaseE();
  });

  test('with a batch, signal propagation is delayed to prevent surprising behaviour', () => {
    const s1 = signal(2);
    const s2 = signal(0);

    const releaseE = effect(() => (s1.value = s2.value));

    let valueObserved = 0;
    batch(() => {
      s1.value = 0;
      s2.value = 1;
      valueObserved = s1.value;
    });

    assert.equal(valueObserved, 0, 'surprising behaviour should not occur');

    releaseE();
  });
});
