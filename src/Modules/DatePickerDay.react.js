'use strict';

import _ from 'lodash';
import ClassNames from 'classnames';
import DatePickerUtils from '../utils/DatePickerUtils.js';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import React, { Component } from 'react';

class DatePickerDay extends Component {
    constructor() {
        super();

        this._onClick = this._onClick.bind(this);
    }

    render() {
        const { dateInView } = this.props;
        const containerClasses = ClassNames('ui', 'date-picker-day', {
            'date-picker-day-disabled': this._isDisabled(),
            'date-picker-day-end-selected': this._isDayEndSelected(),
            'date-picker-day-has-event': this._hasEvent(),
            'date-picker-day-in-range': this._isInRange(),
            'date-picker-day-no-end-day-selected': this._isDayStartSelected() && !this.props.dateEnd,
            'date-picker-day-outside-month': this._isOutsideMonth(),
            'date-picker-day-selected': this._isDaySelected(),
            'date-picker-day-start-selected': this._isDayStartSelected(),
            'date-picker-day-today': this._isToday(),
            'date-picker-day-weekend': this._isWeekend(),
        });

        return (
            <div
                className={containerClasses}
                onClick={this._onClick}
            >
                <span>
                    {moment(dateInView).format('DD')}
                </span>
            </div>
        );
    }

    _hasEvent() {
        return _.some(this.props.events, event => moment.unix(event).utc().isSame(this.props.dateInView, 'day'));
    }

    _isDaySelected() {
        if (this.props.type !== 'dateRange' ||
            this.props.type !== 'servicePeriod' ||
            this.props.type !== 'servicePeriodRange' ||
            this.props.type !== 'servicePeriodRangeEnd' ||
            this.props.type !== 'servicePeriodRangeStart'
        ) {
            return DatePickerUtils.isSameDay(this.props.dateInView, this.props.date);
        }
    }

    _isDayStartSelected() {
        const { dateSecondaryStart, dateStart } = this.props;

        if (this.props.type === 'dateRange' ||
            this.props.type === 'servicePeriod' ||
            this.props.type === 'servicePeriodRange' ||
            this.props.type === 'servicePeriodRangeEnd' ||
            this.props.type === 'servicePeriodRangeStart'
        ) {
            return DatePickerUtils.isSameDay(this.props.dateInView, dateStart) ||
                DatePickerUtils.isSameDay(this.props.dateInView, dateSecondaryStart);
        }
    }

    _isDisabled() {
        return DatePickerUtils.isDayDisabled(this.props.dateInView, this.props);
    }

    _isDayEndSelected() {
        const { dateEnd, dateSecondaryEnd } = this.props;
        if (this.props.type === 'dateRange' ||
            this.props.type === 'servicePeriod' ||
            this.props.type === 'servicePeriodRange' ||
            this.props.type === 'servicePeriodRangeEnd' ||
            this.props.type === 'servicePeriodRangeStart'
        ) {
            return DatePickerUtils.isSameDay(this.props.dateInView, dateEnd) ||
                DatePickerUtils.isSameDay(this.props.dateInView, dateSecondaryEnd);
        }
    }

    _isInRange() {
        const { dateEnd, dateInView, dateSecondaryEnd, dateSecondaryStart, dateStart, type } = this.props;
        const newDateInView = dateInView.clone().startOf('day');

        if (!dateStart || !dateEnd) {
            return false;
        }

        const newDateStart = dateStart.clone().startOf('day');
        const newDateEnd = dateEnd.clone().startOf('day');

        if (type === 'servicePeriodRangeEnd' && dateSecondaryStart || dateSecondaryEnd) {
            const newDateSecondaryStart = dateSecondaryStart.clone().startOf('day');
            const newDateSecondaryEnd = dateSecondaryEnd.clone().startOf('day');

            return newDateInView.isBetween(newDateStart, newDateEnd) ||
                newDateInView.isBetween(newDateEnd, newDateSecondaryStart) ||
                newDateInView.isBetween(newDateSecondaryStart, newDateSecondaryEnd);
        } else {
            return newDateInView.isBetween(newDateStart, newDateEnd);
        }
    }

    _isOutsideMonth() {
        const { month } = this.props;

        return !_.isUndefined(month) && month !== this.props.dateInView.month();
    }

    _isToday() {
        return this.props.dateInView.format('MM/DD/YYYY') === moment().format('MM/DD/YYYY');
    }

    _isWeekend() {
        const weekday = this.props.dateInView.day();

        return weekday === 0 || weekday === 6;
    }

    _onClick(event) {
        const { onClick } = this.props;

        if (!this._isOutsideMonth() && !this._isDisabled() && _.isFunction(this.props.onClick)) {
            this.props.onClick(event);
        }
    }
}

DatePickerDay.propTypes = {
    date: PropTypes.object,
    dateEnd: PropTypes.object,
    dateInView: PropTypes.object.isRequired,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    month: PropTypes.number,
    onDayClick: PropTypes.func,
    type: PropTypes.string,
    uxMode: PropTypes.string
};

export default DatePickerDay;
