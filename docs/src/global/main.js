'use strict';

import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

export default class Main extends React.Component {

    render() {
        const containerClasses = ClassNames('ui', 'main', `page-${this.props.page}`);

        return (
            <main className={containerClasses} style={this.props.style}>
                {this.props.children}
            </main>
        );
    }

}

Main.propTypes = {
    page: PropTypes.string,
    style: PropTypes.object
};
