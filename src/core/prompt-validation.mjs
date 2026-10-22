
function validatePrompt(sourceText) {
  if (typeof sourceText !== 'string') {
    throw new TypeError('Prompt source must be a string.');
  }

  const warnings = [];
  const openingParentheses = [];

  for (let index = 0; index < sourceText.length; index += 1) {
    const character = sourceText[index];

    if (character === '(') {
      openingParentheses.push(index);
      continue;
    }

    if (character === ')') {
      if (openingParentheses.length === 0) {
        warnings.push({
          code: 'unmatched-closing-parenthesis',
          message: 'Closing parenthesis has no matching opening parenthesis.',
          position: index,
        });
      } else {
        openingParentheses.pop();
      }
    }
  }

  for (const position of openingParentheses) {
    warnings.push({
      code: 'unclosed-opening-parenthesis',
      message: 'Opening parenthesis has no matching closing parenthesis.',
      position,
    });
  }

  warnings.sort((a, b) => a.position - b.position);

  return { warnings };
}

export { validatePrompt };
    