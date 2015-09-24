import mui from 'material-ui';
import React, { PropTypes } from 'react';

import { getCustomThemeManager } from '../utils/ThemeManager';
import { fontColors, fontWeights } from '../constants/styles';

import CSSComponent from './CSSComponent';

const {
    FlatButton,
} = mui;

const ThemeManager = getCustomThemeManager();
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
        onDismiss() {},
        onSave() {},
    }


    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillMount() {
        this.customizeTheme(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.customizeTheme(nextProps);
    }

    originalDesktopKeylineIncrement = ThemeManager.getCurrentTheme().spacing.desktopKeylineIncrement

    customizeTheme(props) {
        ThemeManager.setPalette({
            canvasColor: common.background.backgroundColor,
        });
        if (!props.largerDevice) {
            ThemeManager.setSpacing({desktopKeylineIncrement: 0});
        } else {
            ThemeManager.setSpacing({desktopKeylineIncrement: this.originalDesktopKeylineIncrement});
        }
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
                        fontSize: '12px',
                        ...fontColors.light,
                        ...fontWeights.semiBold,
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

    renderSaveButton() {
        const {
            dialogSaveLabel,
        } = this.props;

        if (dialogSaveLabel !== '') {
            return (
                <div is="DialogSave">
                    <FlatButton
                        is="DialogSaveButton"
                        label={dialogSaveLabel}
                        onTouchTap={() => {
                            this.props.onSave();
                        }}
                    />
                </div>
            );
        }
    }

    render() {
        const {
            children,
            dialogDismissLabel,
            dialogSaveLabel,
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
                            onTouchTap={() => {
                                this.dismiss();
                            }}
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
