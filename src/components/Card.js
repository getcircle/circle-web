import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import { fontColors, fontWeights } from '../constants/styles';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

class Card extends CSSComponent {

    // TODO: Add custom validator for editing related props
    static propTypes = {
        children: PropTypes.object,
        contentStyle: PropTypes.object,
        editTitle: PropTypes.string,
        isEditable: PropTypes.bool,
        isEditing: PropTypes.bool,
        onCancelTapped: PropTypes.func,
        onEditTapped: PropTypes.func,
        onSaveTapped: PropTypes.func,
        saveTitle: PropTypes.string,
        style: PropTypes.object,
        subTitle: PropTypes.string,
        subTitleImage: PropTypes.element,
        title: PropTypes.string,
    }

    static defaultProps = {
        editTitle: t('Update'),
        saveTitle: t('Save'),
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
                    alignSelf: 'center',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    paddingLeft: 12,
                    textTransform: 'uppercase',
                    ...fontColors.light,
                    ...fontWeights.semiBold,
                },
                headerActionButton: {
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginRight: 20,
                },
                headerActionButtonLabel: {
                    color: '#8598FF',
                    fontSize: 12,
                    letterSpacing: '1px',
                    ...fontWeights.semiBold,
                },
                root: {
                    boxShadow: '1px 1px 2px 0 rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    borderRadius: 3,
                },
                subTitleText: {
                    alignItems: 'center',
                    alignSelf: 'center',
                    display: 'flex',
                    flex: 1,
                    fontSize: '12px',
                    justifyContent: 'flex-end',
                    lineHeight: '17px',
                    paddingRight: 12,
                    ...fontColors.light,
                },
            }
        }
    }

    renderHeader() {
        const {
            title,
            subTitleImage,
            subTitle
        } = this.props;

        if (title) {
            return (
                <header className="row middle-xs" is="header">
                    <span is="headerText">
                        {title}
                    </span>
                    <span className="row end-xs" is="subTitleText">
                        {subTitleImage}
                        {subTitle}
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
            saveTitle,
        } = this.props;

        return (
            <div className="row end-xs" is="headerActionButton">
                <FlatButton
                    label={t('Cancel')}
                    labelStyle={this.styles().headerActionButtonLabel}
                    onTouchTap={onCancelTapped}
                />
                <FlatButton
                    label={saveTitle}
                    labelStyle={this.styles().headerActionButtonLabel}
                    onTouchTap={onSaveTapped}
                />
            </div>
        );
    }

    renderButton() {
        const {
            editTitle,
            onEditTapped,
        } = this.props;

        return (
            <div className="row end-xs" is="headerActionButton">
                <FlatButton
                    label={editTitle}
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
