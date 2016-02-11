import mui from 'material-ui';

import React, { PropTypes } from 'react';

import { fontColors, fontWeights } from '../constants/styles';
import tracker from '../utils/tracker';

import CSSComponent from './CSSComponent';
import InternalPropTypes from './InternalPropTypes';

const {
    FlatButton,
} = mui;

class Dialog extends CSSComponent {

    static propTypes = {
        children: PropTypes.node,
        dialogDismissLabel: PropTypes.string,
        dialogSaveLabel: PropTypes.string,
        onRequestClose: PropTypes.func,
        onSave: PropTypes.func,
        pageType: PropTypes.string.isRequired,
        title: PropTypes.string,
    }

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
        muiTheme: PropTypes.object.isRequired,
    }

    static defaultProps = {
        // TODO this should be an icon
        dialogDismissLabel: 'x',
        dialogSaveLabel: '',
        onRequestClose() {},
        onSave() {},
    }

    state = {
        open: false,
        saveEnabled: true,
    }

    styles() {
        return this.css({
            smallDevice: !this.context.device.largerDevice,
        });
    }

    classes() {
        const { muiTheme } = this.context;

        return {
            default: {
                Dialog: {
                    contentStyle: {
                        maxWidth: 640,
                        width: 640,
                    },
                    bodyStyle: {
                        padding: 0,
                        paddingTop: 10,
                    },
                },
                DialogClose: {
                },
                DialogCloseButton: {
                    style: {
                        minWidth: 15,
                    },
                    labelStyle: {
                        color: muiTheme.luno.tintColor,
                        fontSize: 11,
                        padding: '0 15px',
                        textTransform: 'uppercase',
                    },
                },
                DialogHeader: {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        paddingBottom: 10,
                    },
                },
                DialogSave: {
                },
                DialogSaveButton: {
                    style: {
                        backgroundColor: muiTheme.luno.tintColor,
                        borderRadius: 100,
                        marginRight: 10,
                        minWidth: 15,
                    },
                    labelStyle: {
                        fontSize: 11,
                        padding: '0 15px',
                        textTransform: 'uppercase',
                        ...fontColors.white,
                    },
                },
                DialogTitle: {
                    className: 'row col-xs middle-xs center-xs',
                    style: {
                        alignSelf: 'center',
                        display: 'flex',
                        fontSize: '18px',
                        letterSpacing: '1px',
                        ...fontColors.dark,
                    },
                },
                placeholder: {
                    width: '40px',
                },
            },
            'smallDevice': {
                Dialog: {
                    contentStyle: {
                        maxWidth: '100vw',
                        width: '100%',
                    },
                    style: {
                        paddingTop: 0,
                    },
                },
            },
        };
    }

    // Public Methods

    show() {
        tracker.trackPageView(this.props.pageType, '');
        this.setState({
            open: true,
        });
    }

    dismiss() {
        this.props.onRequestClose();
        this.setState({
            open: false,
        });
    }

    setSaveEnabled(enabled) {
        this.setState({
            saveEnabled: enabled,
        });
    }

    renderSaveButton() {
        const {
            dialogSaveLabel,
        } = this.props;

        if (dialogSaveLabel !== '') {
            return (
                <div {...this.styles().DialogSave}>
                    <FlatButton
                        disabled={!this.state.saveEnabled}
                        label={dialogSaveLabel}
                        onTouchTap={() => this.props.onSave()}
                        ref="saveButton"
                        {...this.styles().DialogSaveButton}
                    />
                </div>
            );
        }
        else {
            return (
                <div style={this.styles().placeholder}>
                </div>
            );
        }
    }

    render() {
        const {
            children,
            dialogDismissLabel,
            title,
            ...other,
        } = this.props;
        const dialogProps = {...this.styles().Dialog, ...other};

        return (
            <mui.Dialog
                open={this.state.open}
                ref="modal"
                {...dialogProps}
            >
                <header className="row between-xs" {...this.styles().DialogHeader}>
                    <div {...this.styles().DialogClose}>
                        <FlatButton
                            label={dialogDismissLabel}
                            onTouchTap={() => this.dismiss()}
                            {...this.styles().DialogCloseButton}
                        />
                    </div>
                    <span {...this.styles().DialogTitle}>
                        {title}
                    </span>
                    {this.renderSaveButton()}
                </header>
                {children}
            </mui.Dialog>
        );
    }

}

export default Dialog;
