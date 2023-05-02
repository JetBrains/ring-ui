import defaultMessages from './messages.json';

export type MessagesStrict = typeof defaultMessages;

export type Messages = Partial<MessagesStrict>;

let messages: Messages = defaultMessages;

function warnMissedKeyOnce(key: keyof MessagesStrict) {
  const warned = new Set<string>();
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

export function translate(key: keyof MessagesStrict): string {
  if (!(key in messages)) {
    warnMissedKeyOnce(key);
  }
  return messages[key] ?? defaultMessages[key];
}
