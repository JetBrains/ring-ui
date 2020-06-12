/**
 * @enum {number}
 */
export const Type = {
  SEPARATOR: 0,
  LINK: 1,
  ITEM: 2,
  HINT: 3,
  CUSTOM: 4,
  TITLE: 5,
  MARGIN: 6
};

export const Dimension = {
  ITEM_PADDING: 16,
  ITEM_HEIGHT: 32,
  COMPACT_ITEM_HEIGHT: 24,
  SEPARATOR_HEIGHT: 25,
  SEPARATOR_FIRST_HEIGHT: 16,
  SEPARATOR_TEXT_HEIGHT: 18,
  TITLE_HEIGHT: 42,
  INNER_PADDING: 8,
  MARGIN: 8
};

export const DEFAULT_ITEM_TYPE = Type.ITEM;
