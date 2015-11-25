import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';

import { fontColors, fontWeights } from '../constants/styles';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

class Card extends CSSComponent {

    // TODO: Add custom validator for editing related props
    static propTypes = {
        children: PropTypes.node,
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
        title: PropTypes.string,
    }

    static defaultProps = {
        editTitle: t('Update'),
        saveTitle: t('Save'),
        subTitle: '',
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
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    ...fontColors.light,
                    ...fontWeights.semiBold,
                },
                headerActionButton: {
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
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

    renderSubTitle() {
        const {
            subTitle,
        } = this.props;

        if (subTitle && subTitle.trim() !== '') {
            return (
                <div className="col-xs end-xs" is="subTitleText">
                    <div className="box">
                        {subTitle}
                    </div>
                </div>
            );
        }
    }

    renderHeader() {
        const {
            title,
        } = this.props;

        if (title) {
            return (
                <header className="row middle-xs" is="header">
                    <div className="col-xs start-xs" is="headerText">
                        <div className="box">
                            {title}
                        </div>
                    </div>
                    {this.renderSubTitle()}
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
            <div className="col-xs end-xs" is="headerActionButton">
                <div className="box">
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
            </div>
        );
    }

    renderButton() {
        const {
            editTitle,
            onEditTapped,
        } = this.props;

        return (
            <div className="col-xs end-xs" is="headerActionButton">
                <div className="box">
                    <FlatButton
                        label={editTitle}
                        labelStyle={this.styles().headerActionButtonLabel}
                        onTouchTap={onEditTapped}
                    />
                </div>
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
