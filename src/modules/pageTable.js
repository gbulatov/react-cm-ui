import _ from 'lodash';
import ClassNames from 'classnames';
import Icon from '../elements/icon';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '../collections/table.js';

class PageTableRow extends React.PureComponent {
    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }

    render() {
        const {
            columns,
            idPrefix,
            isClickable,
            row,
            rowIndex,
            sizes,
            splitter,
        } = this.props;

        return (
            <Table.Row
                onClick={isClickable ? this._onClick : null}
            >
                {_.map(columns, (column, index) => {
                    let accessor = null;

                    if (_.isString(column.accessor)) {
                        accessor = _.get(row, column.accessor);
                    } else if (_.isFunction(column.accessor)) {
                        accessor = column.accessor(row);
                    }

                    const style = {};
                    const size = _.isEmpty(sizes) ? null : sizes[rowIndex][index];

                    if (size) {
                        style.height = size.h;
                        style.width = size.w;
                    }

                    if (idPrefix === 'column') {
                        if (splitter && _.last(columns) === column) {
                            style.borderRight = '1px solid #edf1f5';
                        }
                    }

                    const id = `table--table_cell-${idPrefix}-${rowIndex}-${index}`;

                    return (
                        <Table.Cell
                            id={id}
                            key={id}
                            textAlign={column.textAlign}
                            style={style}
                        >
                            {accessor}
                        </Table.Cell>
                    );
                })}
            </Table.Row>
        );
    }

    _onClick() {
        const { isClickable, row, rowProps } = this.props;
        const isTextSelect = window.getSelection().toString();

        if (isClickable && !isTextSelect) {
            rowProps().onClick(row);
        }
    }
}

PageTableRow.propTypes = {
    columns: PropTypes.array.isRequired,
    idPrefix: PropTypes.string.isRequired,
    isClickable: PropTypes.bool,
    row: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    rowProps: PropTypes.func,
    sizes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
    splitter: PropTypes.bool,
};

class PageTable extends React.PureComponent {
    constructor() {
        super();
        this._onSplitterClick = this._onSplitterClick.bind(this);
        this._onSplitterTouchEnd = this._onSplitterTouchEnd.bind(this);
        this._onSplitterTouchMove = this._onSplitterTouchMove.bind(this);
        this._onSplitterTouchStart = this._onSplitterTouchStart.bind(this);
    }

    componentWillUnmount() {
        if (this.state.splitter && this._splitterRef) {
            this._splitterRef.removeEventListener('touchstart', this._onSplitterTouchStart);
            this._splitterRef.removeEventListener('touchmove', this._onSplitterTouchMove);
            this._splitterRef.removeEventListener('touchend', this._onSplitterTouchEnd);
        }
    }

    render() {
        const {
            bleed,
            className,
            columns,
            data,
            dropShadow,
            fontSize,
            idPrefix,
            rowProps,
            sizes,
            small,
            splitter,
            style,
        } = this.props;
        const containerClasses = ClassNames('ui', 'page--table', className);
        const bodyClasses = ClassNames({'drop-shadow': dropShadow});
        const isSelectable =
            _.isFunction(rowProps) && _.isFunction(rowProps().onClick);

        return (
            <div
                className={containerClasses}
                style={Object.assign({}, style, {
                    margin: bleed ? '0 -22px' : null,
                })}
            >
                <Table
                    basic
                    className="page--table_component"
                    fontSize={fontSize}
                    selectable={isSelectable}
                    small={small}
                    stretch={bleed ? 'very' : null}
                >
                    <Table.Header>
                        <Table.Row>
                            {_.map(columns, (column, index) => {
                                const hasSplitter =
                                    idPrefix === 'column' &&
                                    splitter &&
                                    _.last(columns) === column;
                                return (
                                    <Table.HeaderCell
                                        className="page--table_header_cell"
                                        key={`tableBodyRow-${index}`}
                                    >
                                        {column.header}
                                        {hasSplitter && (
                                            <Icon
                                                className="table-header-splitter"
                                                color="static"
                                                compact
                                                onClick={this._onSplitterClick}
                                                size="small"
                                                type="splitter"
                                            />
                                        )}
                                    </Table.HeaderCell>
                                );
                            })}
                        </Table.Row>
                    </Table.Header>

                    <Table.Body className={bodyClasses}>
                        {_.map(data, (row, index) => {
                            return (
                                <PageTableRow
                                    columns={columns}
                                    idPrefix={idPrefix}
                                    isClickable={isSelectable}
                                    key={`tableBodyRow-${row.id || index}`}
                                    row={row}
                                    rowIndex={index}
                                    rowProps={rowProps}
                                    sizes={sizes}
                                    splitter={splitter}
                                />
                            );
                        })}
                    </Table.Body>
                </Table>
            </div>
        );
    }

    _initTouchEvents(ref) {
        if (!this.state.splitter || !ref) {
            return;
        }

        this._splitterRef = ref;
        this._splitterRef.addEventListener('touchstart', this._onSplitterTouchStart);
        this._splitterRef.addEventListener('touchmove', this._onSplitterTouchMove, {
            passive: false,
        });
        this._splitterRef.addEventListener('touchend', this._onSplitterTouchEnd);
    }

    _onSplitterClick() {
        const { onSplitter } = this.props;
        onSplitter();
    }

    _onSplitterTouchEnd() {
        
    }

    _onSplitterTouchMove(e) {
        e.preventDefault();
    }

    _onSplitterTouchStart(e) {
        
    }
}

PageTable.defaultProps = {
    bleed: true,
    dropShadow: false,
    fontSize: 'xsmall',
    idPrefix: 'base',
    small: true,
    splitter: false,
};

PageTable.propTypes = {
    bleed: PropTypes.bool,
    className: PropTypes.string,
    collapsed: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    dropShadow: PropTypes.bool,
    fontSize: PropTypes.string,
    idPrefix: PropTypes.string,
    onSplitter: PropTypes.func,
    rowProps: PropTypes.func,
    sizes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
    small: PropTypes.bool,
    splitter: PropTypes.bool,
    style: PropTypes.object,
};

class PageTableContainer extends React.Component {
    constructor(props) {
        super(props);
        this._onResizeDebounce = _.debounce(() => this._onResize(), 80);
        this._onScroll = this._onScroll.bind(this);
        this._onSplitterClick = this._onSplitterClick.bind(this);
        this.state = {
            collapsed: null,
            minWidth: props.minWidth,
            scrolledRight: false,
            sizes: [],
        };
    }

    componentDidMount() {
        this._onResize();
        window.addEventListener('resize', this._onResizeDebounce);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResizeDebounce);
    }

    render() {
        const { bleed, className, columns, stickyColumns, style } = this.props;
        const { collapsed, minWidth, scrolledRight, sizes } = this.state;

        const isStickyColumns = stickyColumns > 0;
        const containerClasses = ClassNames('ui', 'page--table', className, {
            'page--table-sticky_columns': isStickyColumns,
        });
        const newStyle = Object.assign({}, style, {
            margin: bleed ? '0 -22px' : null,
        });

        if (isStickyColumns) {
            return (
                <div
                    className={containerClasses}
                    style={newStyle}
                >
                    <div
                        className="page--table_fixed_body"
                        onScroll={this._onScroll}
                    >
                        <PageTable
                            {...this.props}
                            collapsed={collapsed}
                            idPrefix="body"
                            ref={ref => this._bodyTable = ref}
                            sizes={sizes}
                            style={{ minWidth }}
                        />
                    </div>
                    <div className="page--table_fixed_column">
                        <PageTable
                            {...this.props}
                            columns={_.slice(columns, 0, stickyColumns)}
                            dropShadow={scrolledRight}
                            idPrefix="column"
                            onSplitter={this._onSplitterClick}
                            sizes={sizes}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    className={containerClasses}
                    style={newStyle}
                >
                    <PageTable {...this.props} />
                </div>
            );
        }
    }

    _onResize() {
        const { data, minWidth, splitter, stickyColumns, stickyColumnWidth } = this.props;
        const { collapsed } = this.state;
        const sizes = [];

        const elContainer = document.querySelector('.ui.page--table-sticky_columns');

        if (!elContainer) {
            return;
        }

        const totalWidth = elContainer.clientWidth;

        for (let i = 0; i < data.length; i++) {
            const row = [];
            let rowWidth = 0;

            for (let j = 0; j < stickyColumns; j++) {
                const el = document.querySelector(`#table--table_cell-body-${i}-${j}`);
                const size = {
                    w: `${el.clientWidth}px`,
                };

                if (splitter && j === stickyColumns - 1) {
                    if (collapsed === true) {
                        size.w = `${Math.min(stickyColumnWidth, totalWidth)}px`;
                    } else if (collapsed === false) {
                        size.w = `${Math.max(stickyColumnWidth, totalWidth - stickyColumnWidth - rowWidth)}px`;
                    } else {
                        size.w = `${totalWidth/2}px`;
                    }
                }

                rowWidth += el.clientHeight;
                row.push(size);
            }

            sizes.push(row);
        }

        const newState = { sizes };

        if (collapsed === true) {
            newState.minWidth = minWidth;
        } else if (collapsed === false) {
            const diff = totalWidth - stickyColumnWidth;

            if (diff > 0) {
                newState.minWidth = minWidth + diff;
            }
        } else { 
            const diff = (totalWidth - stickyColumnWidth)/2;

            if (diff > 0) {
                newState.minWidth = minWidth + diff;
            }
        }

        this.setState(newState);
    }

    _onScroll(e) {
        this.setState({ scrolledRight: e.nativeEvent.target.scrollLeft > 0 });
    }

    _onSplitterClick() {
        this.setState(
            prev => ({
                collapsed:
                    prev.collapsed === true ?
                        false :
                        prev.collapsed === false ?
                            null :
                            true,
            }),
            () => {
                this._onResize();
            }
        );
    }
}

PageTableContainer.defaultProps = {
    minWidth: 800,
    splitter: true,
    stickyColumns: 0,
    stickyColumnWidth: 30,
};

PageTableContainer.propTypes = {
    bleed: PropTypes.bool,
    className: PropTypes.string,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    fontSize: PropTypes.string,
    minWidth: PropTypes.number,
    rowProps: PropTypes.func,
    small: PropTypes.bool,
    splitter: PropTypes.bool,
    stickyColumnWidth: PropTypes.number,
    stickyColumns: PropTypes.number,
    style: PropTypes.object,
};

export default PageTableContainer;
