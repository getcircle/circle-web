import mui from 'material-ui';
import React, { PropTypes } from 'react';

import CurrentTheme from '../utils/ThemeManager';
import { fontColors, fontWeights } from '../constants/styles';
import tracker from '../utils/tracker';

import CSSComponent from './CSSComponent';

const {
    FlatButton,
} = mui;

class Dialog extends CSSComponent {

    static propTypes = {
        children: PropTypes.node,
        dialogDismissLabel: PropTypes.string,
        dialogSaveLabel: PropTypes.string,
        largerDevice: PropTypes.bool.isRequired,
        onRequestClose: PropTypes.func,
        onSave: PropTypes.func,
        pageType: PropTypes.string.isRequired,
        title: PropTypes.string,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
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
        muiTheme: CurrentTheme,
        saveEnabled: true,
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

    originalDesktopKeylineIncrement = CurrentTheme.rawTheme.spacing.desktopKeylineIncrement;

    customizeTheme(props) {
        let customDialogTheme = mui.Styles.ThemeManager.modifyRawThemePalette(CurrentTheme, {
            canvasColor: 'rgb(242, 242, 242)',
        });

        customDialogTheme = mui.Styles.ThemeManager.modifyRawThemePalette(customDialogTheme, {
            alternateTextColor: 'rgb(242, 242, 242)',
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
                        width: 480,
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
                        fontSize: '14px',
                        padding: '0 15px',
                        textTransform: 'none',
                        ...fontColors.dark,
                    },
                },
                DialogHeader: {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    },
                },
                DialogSave: {
                },
                DialogSaveButton: {
                    style: {
                        minWidth: 15,
                    },
                    labelStyle: {
                        fontSize: '14px',
                        padding: '0 15px',
                        textTransform: 'none',
                        ...fontColors.dark,
                    },
                },
                DialogTitle: {
                    className: 'row col-xs middle-xs center-xs',
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
                placeholder: {
                    width: '40px',
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
