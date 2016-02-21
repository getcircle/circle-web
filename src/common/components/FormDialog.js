import { merge } from 'lodash';
import React, { PropTypes } from 'react';

import Colors from '../styles/Colors';
import t from '../utils/gettext';

import CSSComponent from  './CSSComponent';
import Dialog from './Dialog';
import Form from './Form';

export default class FormDialog extends CSSComponent {

    static propTypes = {
        children: PropTypes.node,
        error: PropTypes.string,
        modal: PropTypes.bool,
        onCancel: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        pageType: PropTypes.string.isRequired,
        style: PropTypes.object,
        submitLabel: PropTypes.string.isRequired,
        submitting: PropTypes.bool,
        title: PropTypes.string,
        visible: PropTypes.bool.isRequired,
        warning: PropTypes.string,
    };

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
    }

    state = {
        muiTheme: this.context.muiTheme,
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        }
    }

    componentWillMount() {
        const muiTheme = merge({}, this.state.muiTheme);
        muiTheme.paper.backgroundColor = Colors.offWhite;
        this.setState({muiTheme});
    }

    classes() {
        return {
            default: {
                formContainer: {
                    padding: 0,
                    width: '100%',
                },
            },
        };
    }

    renderForm() {
        const { children, onSubmit, submitting } = this.props;

        return (
            <div className="col-xs center-xs" style={this.styles().formContainer}>
                <Form
                    onSubmit={onSubmit}
                    submitting={submitting}
                >
                    {children}
                </Form>
            </div>
        );
    }

    render() {
        const {
            error,
            modal,
            onCancel,
            onSubmit,
            pageType,
            submitLabel,
            title,
            visible,
            warning,
        } = this.props;

        const styles = {
            body: {
                padding: '10px 0 0',
                overflow: 'visible',
            },
        };

        return (
            <div>
                <Dialog
                    bodyStyle={styles.body}
                    dismissLabel={t('Cancel')}
                    error={error}
                    modal={modal}
                    onRequestClose={onCancel}
                    onSave={onSubmit}
                    open={visible}
                    pageType={pageType}
                    ref="modal"
                    repositionOnUpdate={false}
                    saveLabel={submitLabel}
                    title={title}
                    warning={warning}
                >
                    <div className="row center-xs">
                        {this.renderForm()}
                    </div>
                </Dialog>
            </div>
        );
    }
}
