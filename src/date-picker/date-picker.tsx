import {PureComponent, Ref, ButtonHTMLAttributes} from 'react';
import * as React from 'react';
import classNames from 'classnames';
import type {Locale} from 'date-fns';
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

import Popup, {PopupAttrs} from '../popup/popup';
import Dropdown, {DropdownAttrs} from '../dropdown/dropdown';
import Icon from '../icon';
import Button from '../button/button';
import Link from '../link/link';

import {Size} from '../input/input';

import {I18nContext} from '../i18n/i18n-context';

import DatePopup, {DatePopupProps} from './date-popup';
import {DateInputTranslations, DatePickerChange} from './consts';
import styles from './date-picker.css';
import formats from './formats';

interface PopupComponentProps extends Partial<PopupAttrs> {
  hidden?: boolean
  popupRef: Ref<Popup>
  datePopupProps: Omit<DatePopupProps, 'onComplete' | 'hidden'>
  onClear?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | null | undefined
  onComplete: () => void
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
      Popup.PopupProps.Directions.TOP_RIGHT
    ]}
    {...restProps}
    trapFocus
  >
    <DatePopup
      onClear={onClear}
      {...datePopupProps as DatePopupProps}
      onComplete={onComplete}
    />
  </Popup>
);

export interface DatePickerTranslations extends Partial<DateInputTranslations> {
  setDate: string
  setDateTime: string
  setPeriod: string
}

export type DatePickerProps = Omit<DatePopupProps, 'translations' | 'parseDateInput' | 'onComplete' | 'hidden'> & {
  className: string
  clear: boolean
  inline: boolean
  popupClassName?: string | null | undefined
  dropdownProps?: Partial<DropdownAttrs>
  translations?: DatePickerTranslations | null | undefined,
  displayMonthFormat: (date: Date, locale: Locale | undefined) => string
  displayDayFormat: (date: Date, locale: Locale | undefined) => string
  displayTimeFormat: (date: Date, locale: Locale | undefined) => string
  applyTimeInput: (date: Date, time: string | null | undefined) => Date
  datePlaceholder?: string
  dateTimePlaceholder?: string
  rangePlaceholder?: string
  disabled?: boolean | null | undefined
  parseDateInput: (input: string | null | undefined) => Date | null
  size?: Size
  buttonAttributes?: Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>
}

/**
 * @name Date Picker
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
      return minutes != null ? set(date, {hours, minutes}) : date;
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
    }
  };

  static contextType = I18nContext;
  declare context: React.ContextType<typeof DatePicker.contextType>;

  handleChange = (change: DatePickerChange | Date | null | undefined) => {
    const {onChange, withTime, applyTimeInput} = this.props;
    const adjustedChange =
      withTime && !(change instanceof Date) && change?.date != null
        ? applyTimeInput(change.date, change.time)
        : change;
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
    if (date != null) {
      return displayTimeFormat(date, locale);
    }
    return null;
  }

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
      locale
    } = this.props;
    const {translate} = this.context;

    const date = this.parse(this.props.date);
    const from = this.parse(this.props.from);
    const to = this.parse(this.props.to);
    const time = this.formatTime();

    if (!range && !withTime) {
      return date
        ? displayFormat(date, locale)
        : (datePlaceholder ?? translations?.setDate ?? translate('setDate'));
    } else if (!range && withTime) {
      if (!date && !time) {
        return dateTimePlaceholder ?? translations?.setDateTime ?? translate('setDateTime');
      } else {
        return `${date && displayFormat(date, locale) || '—'}, ${time || '—'}`;
      }
    } else if (from && to) {
      if (!isSameYear(from, to)) {
        return `${displayFormat(from, locale)} — ${displayFormat(to, locale)}`;
      } else if (!isSameMonth(from, to)) {
        return `${displayMonthFormat(from, locale)} — ${displayFormat(to, locale)}`;
      } else if (!isSameDay(from, to)) {
        return `${displayDayFormat(from, locale)} — ${displayFormat(to, locale)}`;
      } else {
        return `${displayFormat(to, locale)}`;
      }
    } else if (from) {
      return `${displayFormat(from, locale)} —`;
    } else if (to) {
      return `— ${displayFormat(to, locale)}`;
    } else {
      return rangePlaceholder ?? translations?.setPeriod ?? translate('setPeriod');
    }
  };

  render() {
    const anchorContent = (
      <div className={styles.anchorContent}>
        <Icon glyph={calendarIcon} className={styles.calendarIcon}/>
        {this.getAnchorText()}
        <Icon glyph={chevronDownIcon} className={styles.chevronDownIcon}/>
      </div>
    );

    const {
      className,
      popupClassName,
      clear,
      inline,
      dropdownProps,
      translations,
      ...datePopupProps
    } = this.props;

    const classes = classNames(
      styles.datePicker,
      className,
      styles[`size${this.props.size}`],
      {
        [styles.inline]: inline
      }
    );

    return (
      <Dropdown
        className={classes}
        disabled={this.props.disabled}
        data-test="ring-date-picker"
        anchor={
          inline
            ? (
              <Link
                data-test-ring-dropdown-anchor
                className={styles.anchor}
                disabled={this.props.disabled ?? false}
                pseudo
              >
                {this.getAnchorText()}
              </Link>
            )
            : (
              <Button
                data-test-ring-dropdown-anchor
                className={styles.anchor}
                text={false}
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
            time: this.formatTime()
          }}
          onComplete={this.closePopup}
        />
      </Dropdown>
    );
  }
}

export type DatePickerAttrs = JSX.LibraryManagedAttributes<typeof DatePicker, DatePickerProps>
