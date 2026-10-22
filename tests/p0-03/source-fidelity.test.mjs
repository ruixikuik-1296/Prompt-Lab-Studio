
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  replaceRange,
  createHistory,
  applyEdit,
  undo,
  redo,
} from '../../src/core/source-fidelity.mjs';

test('T01: preserves weighted syntax outside the edited range', () => {
  const source = '(blue eyes:1.2), 1girl';
  const result = replaceRange(source, source.length, source.length, '!');

  assert.equal(result, '(blue eyes:1.2), 1girl!');
});

test('T02: preserves nested expressions outside the edited range', () => {
  const source = '((long hair)), 1girl';
  const result = replaceRange(source, source.length, source.length, '!');

  assert.equal(result, '((long hair)), 1girl!');
});

test('T03: does not repair incomplete expressions', () => {
  const source = '(blue eyes, 1girl';
  const result = replaceRange(source, source.length, source.length, '!');

  assert.equal(result, '(blue eyes, 1girl!');
});

test('T04: preserves multiline text and line order', () => {
  const source = '1girl,\nblue eyes,\nlong hair';
  const result = replaceRange(source, source.length, source.length, '!');

  assert.equal(result, '1girl,\nblue eyes,\nlong hair!');
});

test('T05: preserves unknown syntax outside the edited range', () => {
  const source = 'custom_token::value, 1girl';
  const result = replaceRange(source, source.length, source.length, '!');

  assert.equal(result, 'custom_token::value, 1girl!');
});

test('T06: preserves punctuation outside the edited range', () => {
  const source = "bird's-eye view, blue-green eyes";
  const result = replaceRange(source, source.length, source.length, '!');

  assert.equal(result, "bird's-eye view, blue-green eyes!");
});

test('T07: preserves consecutive and trailing commas', () => {
  const source = '1girl,, blue eyes,';
  const result = replaceRange(source, source.length, source.length, '!');

  assert.equal(result, '1girl,, blue eyes,!');
});

test('T08: supports an empty source', () => {
  assert.equal(replaceRange('', 0, 0, '1girl'), '1girl');
});

test('T09: replaces only the intended range in the planned source', () => {
  const source = '1girl, blue eyes, long hair';

  const start = source.indexOf('blue eyes');
  const end = start + 'blue eyes'.length;

  const result = replaceRange(source, start, end, 'green eyes');

  assert.equal(result, '1girl, green eyes, long hair');
});

test('T10: rejects invalid ranges without changing the source', () => {
  const source = '1girl, blue eyes';

  assert.throws(() => replaceRange(source, -1, 5, 'green'), RangeError);
  assert.throws(() => replaceRange(source, 10, 3, 'green'), RangeError);
  assert.throws(() => replaceRange(source, 0, source.length + 1, 'green'), RangeError);
});

test('T11: supports insertion at a specific position', () => {
  const source = '1girl, blue eyes';

  const result = replaceRange(source, 7, 7, 'long hair, ');

  assert.equal(result, '1girl, long hair, blue eyes');
});

test('T12: undo and redo restore exact text states', () => {
  let history = createHistory('1girl, blue eyes, long hair');

  history = applyEdit(history, 7, 16, 'green eyes');
  assert.equal(history.current, '1girl, green eyes, long hair');

  history = undo(history);
  assert.equal(history.current, '1girl, blue eyes, long hair');

  history = redo(history);
  assert.equal(history.current, '1girl, green eyes, long hair');
});

test('T13: multiple edits can be undone and redone in order', () => {
  let history = createHistory('1girl, blue eyes, long hair');

  history = applyEdit(history, 7, 16, 'green eyes');
  history = applyEdit(history, 19, 28, 'short hair');

  assert.equal(history.current, '1girl, green eyes, short hair');

  history = undo(history);
  assert.equal(history.current, '1girl, green eyes, long hair');

  history = undo(history);
  assert.equal(history.current, '1girl, blue eyes, long hair');

  history = redo(history);
  assert.equal(history.current, '1girl, green eyes, long hair');

  history = redo(history);
  assert.equal(history.current, '1girl, green eyes, short hair');
});


test('T14: rejects non-string source or replacement values', () => {
  assert.throws(() => replaceRange(null, 0, 0, 'text'), TypeError);
  assert.throws(() => replaceRange('source', 0, 1, null), TypeError);
});

test('T15: rejects non-integer and non-finite ranges', () => {
  const source = '1girl, blue eyes';

  assert.throws(() => replaceRange(source, 1.5, 3, 'x'), RangeError);
  assert.throws(() => replaceRange(source, 0, NaN, 'x'), RangeError);
  assert.throws(() => replaceRange(source, 0, Infinity, 'x'), RangeError);
});

test('T16: undo at the initial state changes nothing', () => {
  const initial = '1girl, blue eyes';
  const history = createHistory(initial);

  const result = undo(history);

  assert.equal(result.current, initial);
  assert.deepEqual(result.past, []);
  assert.deepEqual(result.future, []);
});

test('T17: redo when no future state exists changes nothing', () => {
  const initial = '1girl, blue eyes';
  const history = createHistory(initial);

  const result = redo(history);

  assert.equal(result.current, initial);
  assert.deepEqual(result.past, []);
  assert.deepEqual(result.future, []);
});

test('T18: a new edit after undo clears the old redo history', () => {
  let history = createHistory('1girl, blue eyes');

  history = applyEdit(history, 7, 16, 'green eyes');
  history = undo(history);

  assert.equal(history.current, '1girl, blue eyes');

  history = applyEdit(history, 7, 16, 'red eyes');

  assert.equal(history.current, '1girl, red eyes');
  assert.deepEqual(history.future, []);

  history = redo(history);

  assert.equal(history.current, '1girl, red eyes');
});


test('T19: a replacement with identical text creates no history entry', () => {
  const source = '1girl, blue eyes';
  let history = createHistory(source);

  history = applyEdit(history, 7, 16, 'blue eyes');

  assert.equal(history.current, source);
  assert.deepEqual(history.past, []);
  assert.deepEqual(history.future, []);
});

test('T20: an empty insertion creates no history entry', () => {
  const source = '1girl, blue eyes';
  let history = createHistory(source);

  history = applyEdit(history, 7, 7, '');

  assert.equal(history.current, source);
  assert.deepEqual(history.past, []);
  assert.deepEqual(history.future, []);
});

test('T21: undo and redo at history boundaries preserve all states', () => {
  let history = createHistory('A');

  history = applyEdit(history, 1, 1, 'B');
  history = applyEdit(history, 2, 2, 'C');

  assert.equal(history.current, 'ABC');

  history = undo(history);
  assert.equal(history.current, 'AB');

  history = undo(history);
  assert.equal(history.current, 'A');

  const unchangedAfterUndo = undo(history);
  assert.equal(unchangedAfterUndo.current, 'A');
  assert.deepEqual(unchangedAfterUndo.past, []);

  history = redo(history);
  assert.equal(history.current, 'AB');

  history = redo(history);
  assert.equal(history.current, 'ABC');

  const unchangedAfterRedo = redo(history);
  assert.equal(unchangedAfterRedo.current, 'ABC');
  assert.deepEqual(unchangedAfterRedo.future, []);
});


test('T22: editing does not mutate a previously saved history state', () => {
  const initial = createHistory('1girl, blue eyes');
  const previousPast = [...initial.past];
  const previousFuture = [...initial.future];

  const edited = applyEdit(initial, 7, 16, 'green eyes');

  assert.equal(initial.current, '1girl, blue eyes');
  assert.deepEqual(initial.past, previousPast);
  assert.deepEqual(initial.future, previousFuture);
  assert.equal(edited.current, '1girl, green eyes');
});

test('T23: an invalid edit does not change the existing history state', () => {
  const initial = createHistory('1girl, blue eyes');
  const edited = applyEdit(initial, 7, 16, 'green eyes');

  assert.throws(
    () => applyEdit(edited, -1, 3, 'invalid'),
    RangeError,
  );

  assert.equal(edited.current, '1girl, green eyes');
  assert.deepEqual(edited.past, ['1girl, blue eyes']);
  assert.deepEqual(edited.future, []);
});

test('T24: a no-op edit preserves the existing undo and redo history', () => {
  let history = createHistory('1girl, blue eyes');

  history = applyEdit(history, 7, 16, 'green eyes');
  history = undo(history);

  const before = history;
  const after = applyEdit(history, 7, 16, 'blue eyes');

  assert.equal(after, before);
  assert.equal(after.current, '1girl, blue eyes');
  assert.deepEqual(after.past, []);
  assert.deepEqual(after.future, ['1girl, green eyes']);
});

test('replaceRange uses UTF-16 code unit offsets for emoji', () => {
  assert.equal(replaceRange('A😀B', 1, 3, 'X'), 'AXB');
});

test('replaceRange can edit text immediately before an emoji', () => {
  assert.equal(replaceRange('A😀B', 0, 1, 'X'), 'X😀B');
});

test('replaceRange can edit text immediately after an emoji', () => {
  assert.equal(replaceRange('A😀B', 3, 4, 'X'), 'A😀X');
});

test('replaceRange rejects a range beyond the UTF-16 string length', () => {
  assert.throws(
    () => replaceRange('A😀B', 0, 5, 'X'),
    RangeError,
  );
});

test('createHistory rejects a non-string initial source', () => {
  assert.throws(() => createHistory(null), TypeError);
  assert.throws(() => createHistory(123), TypeError);
});

test('applyEdit rejects a null history', () => {
  assert.throws(
    () => applyEdit(null, 0, 0, 'text'),
    TypeError,
  );
});

test('undo rejects a null history', () => {
  assert.throws(() => undo(null), TypeError);
});

test('redo rejects a null history', () => {
  assert.throws(() => redo(null), TypeError);
});

test('applyEdit rejects a history missing required fields', () => {
  assert.throws(
    () => applyEdit({}, 0, 0, 'text'),
    TypeError,
  );
});

test('undo rejects a history missing required fields', () => {
  assert.throws(
    () => undo({}),
    TypeError,
  );
});

test('redo rejects a history missing required fields', () => {
  assert.throws(
    () => redo({}),
    TypeError,
  );
});

test('applyEdit rejects a history with a non-string current value', () => {
  assert.throws(
    () => applyEdit({
      past: [],
      current: 123,
      future: [],
    }, 0, 0, 'text'),
    TypeError,
  );
});

test('undo rejects a history with a non-array past value', () => {
  assert.throws(
    () => undo({
      past: 'invalid',
      current: 'A',
      future: [],
    }),
    TypeError,
  );
});

test('redo rejects a history with a non-array future value', () => {
  assert.throws(
    () => redo({
      past: [],
      current: 'A',
      future: 'invalid',
    }),
    TypeError,
  );
});

test('applyEdit rejects a history with a non-array past value', () => {
  assert.throws(
    () => applyEdit({
      past: 'invalid',
      current: 'A',
      future: [],
    }, 0, 1, 'B'),
    TypeError,
  );
});

test('applyEdit rejects a history with a non-array future value', () => {
  assert.throws(
    () => applyEdit({
      past: [],
      current: 'A',
      future: 'invalid',
    }, 0, 1, 'B'),
    TypeError,
  );
});

test('undo rejects a history with a non-string current value', () => {
  assert.throws(
    () => undo({
      past: ['A'],
      current: 123,
      future: [],
    }),
    TypeError,
  );
});

test('redo rejects a history with a non-string current value', () => {
  assert.throws(
    () => redo({
      past: [],
      current: 123,
      future: ['B'],
    }),
    TypeError,
  );
});

test('undo rejects a history with a non-string past snapshot', () => {
  assert.throws(
    () => undo({
      past: [123],
      current: 'B',
      future: [],
    }),
    TypeError,
  );
});

test('redo rejects a history with a non-string future snapshot', () => {
  assert.throws(
    () => redo({
      past: [],
      current: 'A',
      future: [123],
    }),
    TypeError,
  );
});

test('P03-T12: preserves unusual delimiters during localized editing', () => {
  const source = '1girl,, blue eyes,';

  const start = source.indexOf('blue eyes');
  const end = start + 'blue eyes'.length;

  const result = replaceRange(source, start, end, 'green eyes');

  assert.equal(result, '1girl,, green eyes,');
});