import { merge } from 'lodash';
import { Dialog as MaterialDialog } from 'material-ui';

import React, { Component, PropTypes } from 'react';

import { FlatButton } from 'material-ui';

import InternalPropTypes from './InternalPropTypes';

const CloseButton = ({ buttonStyle, label, onRequestClose }, { muiTheme }) => {
    const styles = {
        button: {
            marginLeft: 10,
            minWidth: 15,
        },
        label: {
            color: muiTheme.luno.tintColor,
            fontSize: '1.1rem',
            fontWeight: muiTheme.luno.fontWeights.black,
            padding: '0 15px',
            textTransform: 'uppercase',
        },
    };
    return (
        <div>
            <FlatButton
                label={label}
                labelStyle={styles.label}
                onTouchTap={onRequestClose}
                style={merge(styles.button, buttonStyle)}
            />
        </div>
    );
}

CloseButton.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const SaveButton = ({ buttonStyle, label, onSave }, { muiTheme }) => {
    const styles = {
        button: {
            backgroundColor: muiTheme.luno.tintColor,
            borderRadius: 100,
            marginRight: 10,
            minWidth: 15,
        },
        label: {
            fontSize: '1.1rem',
            fontWeight: muiTheme.luno.fontWeights.black,
            padding: '0 20px',
            textTransform: 'uppercase',
            color: muiTheme.baseTheme.palette.alternateTextColor,
        },
        placeholder: {
            width: '40px',
        },
    };

    let button;
    if (label) {
        button = (
            <div>
                <FlatButton
                    label={label}
                    labelStyle={styles.label}
                    onTouchTap={onSave}
                    style={merge(styles.button, buttonStyle)}
                />
            </div>
        );
    } else {
        button = (
            <div style={styles.placeholder}>
            </div>
        );
    }
    return button;
};

SaveButton.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

class Dialog extends Component {
    render() {
        const styles = {
            contentStyle: {
                marginBottom: 50,
                maxWidth: 640,
                width: 640,
            },
            bodyStyle: {
                padding: 0,
                paddingTop: 10,
            },
            header: {
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                paddingBottom: 10,
            },
            root: {
                overflow: 'scroll',
                position: 'absolute',
                zIndex: 3000,
            }
        };
        const {
            children,
            dismissButtonStyle,
            dismissLabel,
            modal,
            onRequestClose,
            onSave,
            open,
            saveButtonStyle,
            saveLabel,
            style,
            title,
            ...other,
        } = this.props;
        const { muiTheme } = this.context;

        const dialogStyle = merge(styles.root, style);
        return (
            <MaterialDialog
                autoDetectWindowHeight={false}
                bodyStyle={styles.bodyStyle}
                contentStyle={styles.contentStyle}
                modal={modal}
                onRequestClose={onRequestClose}
                open={open}
                style={dialogStyle}
                {...other}
            >
                <header className="row between-xs" style={styles.header}>
                    <CloseButton
                        buttonStyle={dismissButtonStyle}
                        label={dismissLabel}
                        onRequestClose={onRequestClose}
                    />
                    <span className="row col-xs middle-xs center-xs" style={muiTheme.luno.dialog.title}>
                        {title}
                    </span>
                    <SaveButton
                        buttonStyle={saveButtonStyle}
                        label={saveLabel}
                        onSave={onSave}
                    />
                </header>
                {children}
            </MaterialDialog>
        );
    }
};

Dialog.propTypes = {
    children: PropTypes.node,
    dismissButtonStyle: PropTypes.object,
    dismissLabel: PropTypes.string,
    modal: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onSave: PropTypes.func,
    open: PropTypes.bool.isRequired,
    saveButtonStyle: PropTypes.object,
    saveLabel: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
};

Dialog.contextTypes = {
    device: InternalPropTypes.DeviceContext.isRequired,
    muiTheme: PropTypes.object.isRequired,
};

Dialog.defaultProps = {
    // TODO this should be an icon
    dismissLabel: 'x',
    saveLabel: '',
    onRequestClose() {},
    onSave() {},
};

export default Dialog;
