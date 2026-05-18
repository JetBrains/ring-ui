import {PureComponent, type Ref, type ButtonHTMLAttributes} from 'react';
import * as React from 'react';
import classNames from 'classnames';
import {format as formatDate} from 'date-fns/format';
import {isSameDay} from 'date-fns/isSameDay';
import {isSameMonth} from 'date-fns/isSameMonth';
import {isSameYear} from 'date-fns/isSameYear';
import {isValid} from 'date-fns/isValid';
import {parse} from 'date-fns/parse';
import {set} from 'date-fns/set';
import calendarIcon from '@jetbrains/icons/calendar';
import chevronDownIcon from '@jetbrains/icons/chevron-down';

import memoize from '../global/memoize';
import Popup, {type PopupAttrs} from '../popup/popup';
import Dropdown, {type DropdownAttrs} from '../dropdown/dropdown';
import Icon from '../icon';
import Button from '../button/button';
import Link from '../link/link';
import {Size} from '../input/input';
import {I18nContext} from '../i18n/i18n-context';
import DatePopup, {type DatePopupProps} from './date-popup';
import {type DateInputTranslations, type DatePickerChange} from './consts';
import formats from './formats';

import type {Locale} from 'date-fns';

import styles from './date-picker.css';

interface PopupComponentProps extends Partial<PopupAttrs> {
  hidden?: boolean;
  popupRef: Ref<Popup>;
  datePopupProps: Omit<DatePopupProps, 'onComplete' | 'hidden'>;
  onClear?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | null | undefined;
  onComplete: () => void;
}

const PopupComponent = ({
  hidden = false,
  className,
  popupRef,
  onClear,
  datePopupProps,
  onComplete,
  ...restProps
}: PopupComponentProps) => (
  <Popup
    hidden={hidden}
    className={className}
    ref={popupRef}
    directions={[
      Popup.PopupProps.Directions.BOTTOM_RIGHT,
      Popup.PopupProps.Directions.BOTTOM_LEFT,
      Popup.PopupProps.Directions.TOP_LEFT,
      Popup.PopupProps.Directions.TOP_RIGHT,
    ]}
    {...restProps}
    trapFocus
  >
    <DatePopup onClear={onClear} {...(datePopupProps as DatePopupProps)} onComplete={onComplete} />
  </Popup>
);

export interface DatePickerTranslations extends Partial<DateInputTranslations> {
  setDate: string;
  setDateTime: string;
  setPeriod: string;
}

export type DatePickerProps = Omit<DatePopupProps, 'translations' | 'parseDateInput' | 'onComplete' | 'hidden'> & {
  /**
   * Class name added to the root element of the control that activates the popup.
   */
  className: string;
  /**
   * Adds a "Clear" button to the popup, which resets `date` (or `from` and `to`) to `null` when clicked.
   */
  clear: boolean;
  /**
   * Displays the popup trigger as text, similar to a link, instead of a button.
   */
  inline: boolean;
  /**
   * Class name added to the root element of the popup.
   */
  popupClassName?: string | null | undefined;
  /**
   * Additional props for the Dropdown component. See **Components/Dropdown**.
   */
  dropdownProps?: Partial<DropdownAttrs>;
  /**
   * Object with custom popup text values.
   */
  translations?: DatePickerTranslations | null | undefined;
  displayMonthFormat: (date: Date, locale: Locale | undefined) => string;
  displayDayFormat: (date: Date, locale: Locale | undefined) => string;
  displayTimeFormat: (date: Date, locale: Locale | undefined) => string;
  applyTimeInput: (date: Date, time: string | null | undefined) => Date;
  datePlaceholder?: string;
  dateTimePlaceholder?: string;
  rangePlaceholder?: string;
  disabled?: boolean | null | undefined;
  parseDateInput: (input: string | null | undefined) => Date | null;
  /**
   * Horizontal size of the popup trigger control. Only applies when `inline` is `false`.
   */
  size?: Size;
  buttonAttributes?: Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>;
};

/**
 * Date Picker lets users select a date, a date and time, or a date range.
 * In the simplest mode, with a single unbounded date, the component needs only two props:
 *
 * - `date` to set the current date, and
 * - `onChange` to be invoked when the user selects the date.
 *
 * To limit the selected date, use one or both of the following props:
 *
 * - `minDate`
 * - `maxDate`
 *
 * To enable time input, use the `withTime` prop.
 *
 * To enable range selection, use the `range` prop. In this mode, use the following props
 * instead of `date`:
 *
 * - `from`
 * - `to`
 *
 * By default, the control that activates the popup is rendered as a button. If you want
 * text instead, similar to a link, use the `inline` prop.
 *
 * The component supports internationalization. For example, in the `en-US` locale,
 * the calendar starts on Sunday.
 *
 * There are also multiple ways to provide custom text and placeholders. See the props
 * interfaces for details.
 */
export default class DatePicker extends PureComponent<DatePickerProps> {
  static defaultProps: DatePickerProps = {
    className: '',
    date: null,
    withTime: false,
    range: false,
    from: null,
    to: null,
    clear: false,
    inline: false,
    size: Size.M,
    displayFormat: (date, locale) => (date ? formatDate(date, 'd MMM yyyy', {locale}) : ''),
    displayMonthFormat: (date, locale) => (date ? formatDate(date, 'd MMM', {locale}) : ''),
    displayDayFormat: (date, locale) => (date ? formatDate(date, 'd', {locale}) : ''),
    displayTimeFormat: (date, locale) => (date ? formatDate(date, 'HH:mm', {locale}) : ''),
    minDate: null,
    maxDate: null,
    onChange() {},
    applyTimeInput(date, timeString) {
      const [hours, minutes] = timeString?.split(':').map(Number) ?? [];
      return minutes !== null && minutes !== undefined ? set(date, {hours, minutes}) : date;
    },
    parseDateInput(string) {
      if (!string) {
        return null;
      }
      const today = new Date();
      for (const format of formats) {
        const date = parse(string, format, today);
        if (isValid(date)) {
          return date;
        }
      }
      return null;
    },
  };

  static contextType = I18nContext;
  declare context: React.ContextType<typeof DatePicker.contextType>;

  handleChange = (change: DatePickerChange | Date | null | undefined) => {
    const {onChange, withTime, applyTimeInput} = this.props;
    const adjustedChange =
      withTime && !(change instanceof Date) && change?.date ? applyTimeInput(change.date, change.time) : change;
    onChange(adjustedChange as Date & DatePickerChange);
  };

  clear = () => {
    let change = null;
    if (this.props.range) {
      change = {from: null, to: null};
    }

    this.handleChange(change);
  };

  popup?: Popup | null;
  popupRef = (el: Popup | null) => {
    this.popup = el;
  };

  closePopup = () => {
    // eslint-disable-next-line no-underscore-dangle
    this.popup?._onCloseAttempt();
  };

  parse = memoize((date: Date | number | string | null | undefined) => {
    const {parseDateInput} = this.props;

    if (date instanceof Date) {
      return date;
    }
    if (typeof date === 'number') {
      return new Date(date);
    }

    return parseDateInput(date);
  });

  formatTime() {
    const {displayTimeFormat, locale} = this.props;
    const date = this.parse(this.props.date);
    if (date) {
      return displayTimeFormat(date, locale);
    }
    return null;
  }

  // eslint-disable-next-line complexity
  getAnchorText = () => {
    const {
      range,
      datePlaceholder,
      dateTimePlaceholder,
      rangePlaceholder,
      withTime,
      displayFormat,
      displayMonthFormat,
      displayDayFormat,
      translations,
      locale,
    } = this.props;
    const {translate} = this.context;

    const date = this.parse(this.props.date);
    const from = this.parse(this.props.from);
    const to = this.parse(this.props.to);
    const time = this.formatTime();

    if (!range && !withTime) {
      return date ? displayFormat(date, locale) : (datePlaceholder ?? translations?.setDate ?? translate('setDate'));
    }
    if (!range && withTime) {
      if (!date && !time) {
        return dateTimePlaceholder ?? translations?.setDateTime ?? translate('setDateTime');
      }
      return `${(date && displayFormat(date, locale)) || '—'}, ${time || '—'}`;
    }
    if (from && to) {
      if (!isSameYear(from, to)) {
        return `${displayFormat(from, locale)} — ${displayFormat(to, locale)}`;
      }
      if (!isSameMonth(from, to)) {
        return `${displayMonthFormat(from, locale)} — ${displayFormat(to, locale)}`;
      }
      if (!isSameDay(from, to)) {
        return `${displayDayFormat(from, locale)} — ${displayFormat(to, locale)}`;
      }
      return `${displayFormat(to, locale)}`;
    }
    if (from) {
      return `${displayFormat(from, locale)} —`;
    }
    if (to) {
      return `— ${displayFormat(to, locale)}`;
    }
    return rangePlaceholder ?? translations?.setPeriod ?? translate('setPeriod');
  };

  render() {
    const anchorContent = (
      <div className={styles.anchorContent}>
        <Icon glyph={calendarIcon} className={styles.calendarIcon} />
        {this.getAnchorText()}
        <Icon glyph={chevronDownIcon} className={styles.chevronDownIcon} />
      </div>
    );

    const {className, popupClassName, clear, inline, dropdownProps, translations, ...datePopupProps} = this.props;

    const classes = classNames(styles.datePicker, className, this.props.size && styles[`size${this.props.size}`], {
      [styles.inline]: inline,
    });

    return (
      <Dropdown
        className={classes}
        disabled={this.props.disabled}
        data-test='ring-date-picker'
        anchor={
          inline ? (
            <Link
              data-test-ring-dropdown-anchor
              className={styles.anchor}
              disabled={this.props.disabled ?? false}
              pseudo
            >
              {this.getAnchorText()}
            </Link>
          ) : (
            <Button
              data-test-ring-dropdown-anchor
              className={styles.anchor}
              inline={false}
              disabled={this.props.disabled ?? false}
              {...this.props.buttonAttributes}
            >
              {anchorContent}
            </Button>
          )
        }
        {...dropdownProps}
      >
        <PopupComponent
          className={popupClassName}
          popupRef={this.popupRef}
          onClear={clear ? this.clear : null}
          datePopupProps={{
            ...datePopupProps,
            translations,
            onChange: this.handleChange,
            parseDateInput: this.parse,
            time: this.formatTime(),
          }}
          onComplete={this.closePopup}
        />
      </Dropdown>
    );
  }
}

export type DatePickerAttrs = React.JSX.LibraryManagedAttributes<typeof DatePicker, DatePickerProps>;
