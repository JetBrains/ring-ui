import List from '../list/list';

import {ListDataItem} from '../list/consts';

import styles from './query-assist.css';

const ICON_ID_LENGTH = 44;

export interface QueryAssistSuggestion {
  description: string;
  group: string;
  icon?: string | undefined;
  option: string;
  prefix?: string | undefined;
  suffix?: string | undefined;
  className?: string | undefined;
  matchingStart?: number;
  matchingEnd?: number;
  caret?: number;
  completionStart?: number;
  completionEnd?: number;
}

export interface SuggestionItem {
  data?: QueryAssistSuggestion;
}

export default class QueryAssistSuggestions {
  /*
   * Pay attention that this method produces not a 100% unique key.
   * Consider to use a unique identifier provided by a server.
   */
  static createKey(suggestion: QueryAssistSuggestion) {
    const {description, group, icon, option, prefix = '', suffix = ''} = suggestion;

    return prefix + option + suffix + group + description + (icon ? icon.substring(icon.length - ICON_ID_LENGTH) : '');
  }

  static renderLabel(suggestion: QueryAssistSuggestion) {
    const {className, matchingStart = 0, matchingEnd = 0, option, prefix = '', suffix = ''} = suggestion;

    let wrappedOption;
    let before = '';
    let after = '';

    if (matchingStart !== matchingEnd) {
      before = option.substring(0, matchingStart);
      wrappedOption = <span className={styles.highlight}>{option.substring(matchingStart, matchingEnd)}</span>;
      after = option.substring(matchingEnd);
    } else {
      wrappedOption = option;
    }

    const wrappedPrefix = prefix && <span className={styles.service}>{prefix}</span>;
    const wrappedSuffix = suffix && <span className={styles.service}>{suffix}</span>;

    return (
      <span className={className}>
        {wrappedPrefix}
        {before}
        {wrappedOption}
        {after}
        {wrappedSuffix}
      </span>
    );
  }

  static renderGroupSeparator(suggestion: QueryAssistSuggestion, prevSuggestion: string) {
    const {group, option} = suggestion;
    const {SEPARATOR} = List.ListProps.Type;

    if (prevSuggestion !== group) {
      return {
        key: option + group + SEPARATOR,
        description: group,
        rgItemType: SEPARATOR,
      };
    }

    return null;
  }

  static renderList(
    suggestions: readonly QueryAssistSuggestion[],
    suggestionRenderer: (suggestion: QueryAssistSuggestion) => ListDataItem<SuggestionItem>,
  ) {
    const renderedSuggestions: ListDataItem<SuggestionItem>[] = [];

    suggestions.forEach((suggestion, index, arr) => {
      const prevSuggestionGroup = arr[index - 1] && arr[index - 1].group;
      const groupSeparator = QueryAssistSuggestions.renderGroupSeparator(suggestion, prevSuggestionGroup);

      if (groupSeparator) {
        renderedSuggestions.push(groupSeparator);
      }

      renderedSuggestions.push(suggestionRenderer(suggestion));
    });

    return renderedSuggestions;
  }
}
