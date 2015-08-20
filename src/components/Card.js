import React, { PropTypes } from 'react';
import mui from 'material-ui';

import StyleableComponent from './StyleableComponent';
import t from '../utils/gettext';

const { FlatButton } = mui;

const styles = {
    contentContainer: {
        display: 'flex',
        flexFlow: 'row',
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, .1)',
        height: 40,
        display: 'flex',
    },
    headerText: {
        fontSize: '14px',
        fontWeight: 600,
        color: 'rgba(0, 0, 0, .4)',
        alignSelf: 'center',
        paddingLeft: 12,
        textTransform: 'uppercase',
    },
    editButton: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 20,
    },
    editButtonLabel: {
        color: '#8598FF',
        fontSize: 16,
        fontWeight: 600,
    },    
    root: {
        boxShadow: '1px 1px 3px -2px',
        backgroundColor: 'white',
        borderRadius: 3,
    },
};

class Card extends StyleableComponent {

    static propTypes = {
        title: PropTypes.string,
        contentStyle: PropTypes.object,
        editable: PropTypes.bool,
        onEditClick: PropTypes.func,
    }

    _renderHeader() {
        const { title } = this.props;
        if (title) {
            return (
                <header style={this.mergeAndPrefix(styles.header)}>
                    <span style={this.mergeAndPrefix(styles.headerText)}>
                        {title}
                    </span>
                    {this._renderEditButton()}
                </header>
            );
        }
    }

    _renderEditButton() {
        const {
            editable,
            onEditClick,
        } = this.props;

        if (editable) {
            return (
                <div style={this.mergeAndPrefix(styles.editButton)}>
                    <FlatButton labelStyle={styles.editButtonLabel} label={t('Edit')} onTouchTap={onEditClick} />
                </div>
            );
        }
    }

    render() {
        const {
            contentStyle,
            style,
            ...other,
        } = this.props;
        return (
            <div style={this.mergeAndPrefix(styles.root, style)} {...other}>
                {this._renderHeader()}
                <div style={this.mergeAndPrefix(contentStyle)}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Card;
