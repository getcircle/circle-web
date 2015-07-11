'use strict';

import _ from 'lodash';
import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React from 'react/addons';

import autoBind from '../utils/autobind';
import bindThis from '../utils/bindThis';
import AuthStore from '../stores/AuthStore';
import constants from '../styles/constants';
import { login } from '../utils/google';
import logger from '../utils/logger';
import t from '../utils/gettext';

const {
    RaisedButton,
    Snackbar,
} = mui;
const { StylePropable } = mui.Mixins;

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
class LoginForm extends React.Component {

    @bindThis
    _handleTouchTap() {
        login()
            .then((details) => {
                this.props.authenticate(AuthStore.backends.GOOGLE, details.code);
            })
            .catch((error) => {
                logger.error(`Error logging in: ${error}`);
                this.refs.snackbar.show();
            });
    }

    styles = {
        button: {
            width: '100%',
            backgroundColor: constants.colors.tint,
            height: 50,
        },
        container: {
            paddingTop: '15%',
        },
        label: {
            lineHeight: '50px',
            fontSize: 18,
            fontWeight: 300,
        },
        text: {
            color: constants.colors.lightText,
        },
        header: {
            fontSize: 36,
            paddingBottom: 50,
        },
        subHeader: {
            fontSize: 26,
            paddingBottom: 20,
        },
    }

    componentDidUpdate() {
        if (this.props.authError) {
            logger.error(`Error logging in: ${this.props.authError}`);
            this.refs.snackbar.show();
        }
    }

    render() {
        const headerStyle = _.assign({}, this.styles.text, this.styles.header);
        const subHeaderStyle = _.assign({}, this.styles.text, this.styles.subHeader);
        return (
            <div style={this.styles.container} className="row">
                <section className="col-sm-offset-4 col-sm-4">
                    <div>
                        <div className="row center-xs">
                            <h1 style={headerStyle}>{ t('circle') }</h1>
                        </div>
                        <div className="row center-xs">
                            <h2 style={subHeaderStyle}>{ t('know the people you work with') }</h2>
                        </div>
                        <div className="row center-xs">
                            <RaisedButton
                                label={`${ t('START USING CIRCLE') }`}
                                style={this.styles.button}
                                labelStyle={this.styles.label}
                                primary={true}
                                onTouchTap={this._handleTouchTap}
                            />
                        </div>
                    </div>
                </section>

                <Snackbar ref="snackbar" message="Error logging in" />
            </div>
        );
    }

}

export default LoginForm;
