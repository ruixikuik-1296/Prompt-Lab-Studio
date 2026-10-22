
function replaceRange(source, start, end, replacement) {
  if (typeof source !== 'string' || typeof replacement !== 'string') {
    throw new TypeError('Source and replacement must be strings.');
  }

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end < start ||
    end > source.length
  ) {
    throw new RangeError('Invalid source range.');
  }

  return source.slice(0, start) + replacement + source.slice(end);
}

function validateHistory(history) {
  if (
    history === null ||
    typeof history !== 'object' ||
    !Array.isArray(history.past) ||
    typeof history.current !== 'string' ||
    !Array.isArray(history.future) ||
    !history.past.every((snapshot) => typeof snapshot === 'string') ||
    !history.future.every((snapshot) => typeof snapshot === 'string')
  ) {
    throw new TypeError('Invalid history object.');
  }
}

function createHistory(source) {
  if (typeof source !== 'string') {
    throw new TypeError('Initial source must be a string.');
  }

  return {
    past: [],
    current: source,
    future: [],
  };
}

function applyEdit(history, start, end, replacement) {
  validateHistory(history);

  const nextSource = replaceRange(
    history.current,
    start,
    end,
    replacement,
  );

  if (nextSource === history.current) {
    return history;
  }

  return {
    past: [...history.past, history.current],
    current: nextSource,
    future: [],
  };
}

function undo(history) {
  validateHistory(history);

  if (history.past.length === 0) {
    return history;
  }

  const previousSource = history.past[history.past.length - 1];

  return {
    past: history.past.slice(0, -1),
    current: previousSource,
    future: [history.current, ...history.future],
  };
}

function redo(history) {
  validateHistory(history);

  if (history.future.length === 0) {
    return history;
  }

  const nextSource = history.future[0];

  return {
    past: [...history.past, history.current],
    current: nextSource,
    future: history.future.slice(1),
  };
}

export {
  replaceRange,
  createHistory,
  applyEdit,
  undo,
  redo,
};
