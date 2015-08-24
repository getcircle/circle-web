import React, { PropTypes } from 'react';

import StyleableComponent from './StyleableComponent';
import t from '../utils/gettext';

import { FlatButton } from 'material-ui';

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
    headerActionButton: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 20,
    },
    headerActionButtonLabel: {
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

    // TODO: Add custom validator for editing related props
    static propTypes = {
        children: PropTypes.object,
        contentStyle: PropTypes.object,
        isEditable: PropTypes.bool,
        isEditing: PropTypes.bool,
        onCancelTapped: PropTypes.func,
        onEditTapped: PropTypes.func,
        onSaveTapped: PropTypes.func,
        style: PropTypes.object,
        title: PropTypes.string,
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
            isEditable,
            isEditing,
            onEditTapped,
            onSaveTapped,
            onCancelTapped,
        } = this.props;

        if (isEditable) {
            if (isEditing) {
                return (
                    <div style={this.mergeAndPrefix(styles.headerActionButton)}>
                        <FlatButton
                            label={t('Cancel')}
                            labelStyle={styles.headerActionButtonLabel}
                            onTouchTap={onCancelTapped}
                        />
                        <FlatButton
                            label={t('Save')}
                            labelStyle={styles.headerActionButtonLabel}
                            onTouchTap={onSaveTapped}
                        />
                    </div>
                );
            }
            else {
                return (
                    <div style={this.mergeAndPrefix(styles.headerActionButton)}>
                        <FlatButton
                            label={t('Edit')}
                            labelStyle={styles.headerActionButtonLabel}
                            onTouchTap={onEditTapped}
                        />
                    </div>
                );
            }
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
