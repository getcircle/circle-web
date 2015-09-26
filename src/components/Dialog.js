import mui from 'material-ui';
import React, { PropTypes } from 'react';

import CurrentTheme from '../utils/ThemeManager';
import { fontColors, fontWeights } from '../constants/styles';

import CSSComponent from './CSSComponent';

const {
    FlatButton,
} = mui;

const common = {
    background: {
        backgroundColor: 'rgb(249, 245, 244)',
    },
};

class Dialog extends CSSComponent {

    static propTypes = {
        children: PropTypes.object,
        dialogDismissLabel: PropTypes.string,
        dialogSaveLabel: PropTypes.string,
        largerDevice: PropTypes.object.isRequired,
        onDismiss: PropTypes.func,
        onSave: PropTypes.func,
        title: PropTypes.string,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
    }

    static defaultProps = {
        // TODO this should be an icon
        dialogDismissLabel: 'x',
        dialogSaveLabel: '',
        onDismiss() {},
        onSave() {},
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        this.customizeTheme(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.customizeTheme(nextProps);
    }

    state = {
        saveEnabled: true,
        muiTheme: CurrentTheme,
    }

    originalDesktopKeylineIncrement = CurrentTheme.spacing.desktopKeylineIncrement

    customizeTheme(props) {
        let customDialogTheme = mui.Styles.ThemeManager.modifyRawThemePalette(CustomTheme, {
            canvasColor: common.background.backgroundColor,
        });

        if (!props.largerDevice) {
            customDialogTheme = mui.Styles.ThemeManager.modifyRawThemeSpacing(customDialogTheme, {
                desktopKeylineIncrement: 0,
            });
        } else {
            customDialogTheme = mui.Styles.ThemeManager.modifyRawThemeSpacing(customDialogTheme, {
                desktopKeylineIncrement: this.originalDesktopKeylineIncrement,
            });
        }

        this.setState({muiTheme: customDialogTheme});
    }

    classes() {
        return {
            default: {
                Dialog: {
                    contentStyle: {
                        maxWidth: 480,
                    },
                    bodyStyle: {
                        padding: 0,
                        paddingTop: 10,
                    },
                },
                DialogClose: {
                    className: 'col-xs-2',
                },
                DialogCloseButton: {
                    style: {
                        minWidth: 15,
                    },
                    labelStyle: {
                        fontSize: '14px',
                        textTransform: 'none',
                        ...fontColors.dark,
                    },
                },
                DialogHeader: {
                    className: 'row',
                    style: {
                        display: 'flex',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    },
                },
                DialogSave: {
                    className: 'col-xs-2',
                },
                DialogSaveButton: {
                    style: {
                        minWidth: 15,
                    },
                    labelStyle: {
                        fontSize: '14px',
                        textTransform: 'none',
                        ...fontColors.dark,
                    },
                },
                DialogTitle: {
                    className: 'col-xs-8 center-xs',
                    style: {
                        alignSelf: 'center',
                        display: 'flex',
                        fontSize: '12px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        ...fontColors.light,
                        ...fontWeights.semiBold,
                    },
                },
            },
            'largerDevice-false': {
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
        this.refs.modal.show();
    }

    dismiss() {
        this.props.onDismiss();
        this.refs.modal.dismiss();
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
                <div is="DialogSave">
                    <FlatButton
                        disabled={!this.state.saveEnabled}
                        is="DialogSaveButton"
                        label={dialogSaveLabel}
                        onTouchTap={() => this.props.onSave()}
                        ref="saveButton"
                    />
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
        return (
            <mui.Dialog {...other} is="Dialog" ref="modal">
                <header is="DialogHeader">
                    <div is="DialogClose">
                        <FlatButton
                            is="DialogCloseButton"
                            label={dialogDismissLabel}
                            onTouchTap={() => this.dismiss()}
                        />
                    </div>
                    <span is="DialogTitle">
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
