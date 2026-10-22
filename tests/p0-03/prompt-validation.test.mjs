
import test from 'node:test';
import assert from 'node:assert/strict';

import { validatePrompt } from '../../src/core/prompt-validation.mjs';

test('PV01: accepts balanced weighted expressions', () => {
  const source = '(blue eyes:1.2), 1girl';

  assert.deepEqual(validatePrompt(source), { warnings: [] });
});

test('PV02: accepts nested parentheses', () => {
  const source = '((long hair)), 1girl';

  assert.deepEqual(validatePrompt(source), { warnings: [] });
});

test('PV03: warns about an unclosed opening parenthesis', () => {
  const source = '(blue eyes, 1girl';

  assert.deepEqual(validatePrompt(source), {
    warnings: [
      {
        code: 'unclosed-opening-parenthesis',
        message: 'Opening parenthesis has no matching closing parenthesis.',
        position: 0,
      },
    ],
  });
});

test('PV04: warns about an unmatched closing parenthesis', () => {
  const source = '1girl), blue eyes';

  assert.deepEqual(validatePrompt(source), {
    warnings: [
      {
        code: 'unmatched-closing-parenthesis',
        message: 'Closing parenthesis has no matching opening parenthesis.',
        position: 5,
      },
    ],
  });
});

test('PV05: preserves unknown syntax without warnings', () => {
  const source = 'custom_token::value, 1girl';

  assert.deepEqual(validatePrompt(source), { warnings: [] });
  assert.equal(source, 'custom_token::value, 1girl');
});

test('PV06: accepts empty source text', () => {
  assert.deepEqual(validatePrompt(''), { warnings: [] });
});

test('PV07: does not modify incomplete source text', () => {
  const source = '(blue eyes, 1girl';
  const originalSource = source;

  validatePrompt(source);

  assert.equal(source, originalSource);
});

test('PV08: reports multiple unmatched parentheses in source order', () => {
  const source = ')((';
  const result = validatePrompt(source);

  assert.deepEqual(
    result.warnings.map(({ code, position }) => ({ code, position })),
    [
      { code: 'unmatched-closing-parenthesis', position: 0 },
      { code: 'unclosed-opening-parenthesis', position: 1 },
      { code: 'unclosed-opening-parenthesis', position: 2 },
    ],
  );
});

test('PV09: rejects non-string source input', () => {
  assert.throws(() => validatePrompt(null), TypeError);
});
