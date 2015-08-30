import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

class Card extends CSSComponent {

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

    classes() {
        return {
            default: {
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
                    boxShadow: '1px 1px 2px 0 rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    borderRadius: 3,
                },
            }
        }
    }

    renderHeader() {
        const { title } = this.props;
        if (title) {
            return (
                <header is="header">
                    <span is="headerText">
                        {title}
                    </span>
                    {this.renderEditButton()}
                </header>
            );
        }
    }

    renderButtonEditing() {
        const {
            onSaveTapped,
            onCancelTapped,
        } = this.props;

        return (
            <div is="headerActionButton">
                <FlatButton
                    label={t('Cancel')}
                    labelStyle={this.styles().headerActionButtonLabel}
                    onTouchTap={onCancelTapped}
                />
                <FlatButton
                    label={t('Save')}
                    labelStyle={this.styles().headerActionButtonLabel}
                    onTouchTap={onSaveTapped}
                />
            </div>
        );
    }

    renderButton() {
        const {
            onEditTapped,
        } = this.props;

        return (
            <div is="headerActionButton">
                <FlatButton
                    label={t('Edit')}
                    labelStyle={this.styles().headerActionButtonLabel}
                    onTouchTap={onEditTapped}
                />
            </div>
        );
    }

    renderEditButton() {
        const {
            isEditable,
            isEditing,
        } = this.props;

        if (!isEditable) {
            return;
        }

        if (isEditing) {
            return this.renderButtonEditing();
        } else {
            return this.renderButton();
        }
    }

    render() {
        const {
            contentStyle,
            style,
            ...other,
        } = this.props;
        return (
            <div {...other} style={{...this.styles().root, ...style}}>
                {this.renderHeader()}
                <div style={contentStyle}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Card;
