
function validateDocumentTitle(title) {
  if (typeof title !== 'string') {
    throw new TypeError('Document title must be a string.');
  }

  if (title.trim().length === 0) {
    return {
      valid: false,
      error: {
        code: 'empty-title',
        message: 'Document title must not be empty or whitespace-only.',
      },
    };
  }

  return {
    valid: true,
    error: null,
  };
}

export { validateDocumentTitle };
