
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateDocumentTitle,
} from '../../src/core/document-validation.mjs';

test('DV01: accepts a non-empty title', () => {
  assert.deepEqual(validateDocumentTitle('My Prompt'), {
    valid: true,
    error: null,
  });
});

test('DV02: accepts a title with surrounding whitespace', () => {
  const title = '  My Prompt  ';

  const result = validateDocumentTitle(title);

  assert.deepEqual(result, {
    valid: true,
    error: null,
  });
  assert.equal(title, '  My Prompt  ');
});

test('DV03: rejects an empty title', () => {
  assert.deepEqual(validateDocumentTitle(''), {
    valid: false,
    error: {
      code: 'empty-title',
      message: 'Document title must not be empty or whitespace-only.',
    },
  });
});

test('DV04: rejects a whitespace-only title', () => {
  assert.equal(validateDocumentTitle('   ').valid, false);
});

test('DV05: rejects a title containing only tabs and newlines', () => {
  assert.equal(validateDocumentTitle('\t\n').valid, false);
});

test('DV06: rejects non-string title input', () => {
  assert.throws(() => validateDocumentTitle(null), TypeError);
});

test('DV07: does not modify the original title', () => {
  const title = '  My Prompt  ';
  const originalTitle = title;

  validateDocumentTitle(title);

  assert.equal(title, originalTitle);
});
