const BOLD_SYNTAX = '\\*\\*';
const UNDERLINE_SYNTAX = '__';
const ITALIC_SYNTAX = '//';
const STRIKETHROUGH_SYNTAX = '~~';
const GLITCH_SYNTAX = '==';

// Regexps:
const BoldRegExp = new RegExp(`${BOLD_SYNTAX}(.*?)${BOLD_SYNTAX}`, 'g');
const UnderlineRegExp = new RegExp(`${UNDERLINE_SYNTAX}(.*?)${UNDERLINE_SYNTAX}`, 'g');
const ItalicRegExp = new RegExp(`${ITALIC_SYNTAX}(.*?)${ITALIC_SYNTAX}`, 'g');
const StrikethroughRegExp = new RegExp(`${STRIKETHROUGH_SYNTAX}(.*?)${STRIKETHROUGH_SYNTAX}`, 'g');
const GlitchRegExp = new RegExp(`${GLITCH_SYNTAX}(.*?)${GLITCH_SYNTAX}`, 'g');

// Cache WeakMap for memoization
const cache = new WeakMap<object, string>();

export const boldenUnderlineEtc = (text: string) => {
  const textObj = { text }; // Wrap the string in an object

  // Check if the result is already in the WeakMap
  if (cache.has(textObj)) {
    return cache.get(textObj)!;
  }

  const boldenedText = text.replace(BoldRegExp, '<b>$1</b>');
  const underlinedText = boldenedText.replace(UnderlineRegExp, '<u>$1</u>');
  const italicizedText = underlinedText.replace(ItalicRegExp, '<i>$1</i>');
  const strikethroughText = italicizedText.replace(StrikethroughRegExp, '<s>$1</s>');
  const glitchedText = strikethroughText.replace(GlitchRegExp, '<span class="glitch">$1</span>');

  // Store the computed result in the WeakMap
  cache.set(textObj, glitchedText);

  return glitchedText;
};
