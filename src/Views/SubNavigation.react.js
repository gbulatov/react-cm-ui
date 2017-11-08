'use strict';

import ClassNames from 'classnames';
import React, { Component } from 'react';
import _ from 'lodash';

import SubNavigationItem from './SubNavigationItem.react';

class SubNavigation extends Component {

    constructor(props) {
        super(props);

        this.state = { selected: props.selected || 0 };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selected !== nextProps.selected) {
            this.setState({ selected: nextProps.selected });
        }
    }

    render() {
        const { border, className, drawer, style, children } = this.props;
        const containerClasses = ClassNames('ui', 'sub-navigation', className, {
            'sub-navigation-border-bottom': !border || border === 'bottom' || border === 'both',
            'sub-navigation-border-top': border === 'top' || border === 'both',
            'sub-navigation-drawer': drawer
        });
        const childrenArray = children && (_.isArray(children) ? children : [children]);
        let buttons = _.map(childrenArray, (child, index) => {
            const { label, onClick, style } = child.props;
            let isActive = ClassNames({ 'is-active': this.state.selected === index });

            return (
                <button
                    className={isActive}
                    onClick={this._onItemClick.bind(this, index, label, onClick)}
                    key={'sub-navigation-buttons-' + index}
                    style={style}
                >
                    <span className="sub-navigation-button-inner">
                        <span className="copy">{label}</span>
                        <span className="button-is-active-indicator"/>
                    </span>
                </button>
            );
        });

        return (
            <div className={containerClasses} style={style}>
                <div className="sub-navigation-scroll-indicator" />

                <div className="sub-navigation-scroll">
                    <div className="sub-navigation-item-container">
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }

    _onItemClick(index, label, onChildClick, event) {
        if (!_.isUndefined(this.props.onClick)) {
            this.props.onClick(index, label);
        } else {
            if (!_.isUndefined(onChildClick)) {
                onChildClick(index, label);
            }

            this.setState({ selected: index });
        }

        event.preventDefault();
    }

}

SubNavigation.Item = SubNavigationItem;

const borderEnums = [ 'both', 'bottom', 'top' ];

SubNavigation.propTypes = {
    border: React.PropTypes.oneOf(borderEnums),
    className: React.PropTypes.string,
    drawer: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    selected: React.PropTypes.number,
    style: React.PropTypes.object
};

export default SubNavigation;
