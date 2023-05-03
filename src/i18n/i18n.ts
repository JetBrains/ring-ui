import defaultMessages from './messages.json';

export type MessagesStrict = typeof defaultMessages;

export type Messages = Partial<MessagesStrict>;

let messages: Messages = defaultMessages;
const warned = new Set<string>();

function warnMissedKeyOnce(key: keyof MessagesStrict) {
  if (warned.has(key)) {
    return;
  }

  warned.add(key);
  // eslint-disable-next-line no-console
  console.warn(`Missing localisation for key "${key}"`);
}

export function setTranslations(newMessages: Messages) {
  messages = newMessages;
}

export function getTranslations() {
  return messages;
}

export function getTranslationsWithFallback(): MessagesStrict {
  return {...defaultMessages, ...messages};
}

export function translate(key: keyof MessagesStrict): string {
  if (!(key in messages)) {
    warnMissedKeyOnce(key);
  }
  return messages[key] ?? defaultMessages[key];
}
