import defaultMessages from './messages.json';

export type Messages = typeof defaultMessages;

let messages = defaultMessages;

export function setTranslations(newMessages: Messages) {
  messages = newMessages;
}

export function getTranslations() {
  return messages;
}
