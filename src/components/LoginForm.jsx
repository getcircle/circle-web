'use strict';

import { decorate } from 'react-mixin';
import mui from 'material-ui';
import React from 'react/addons';

import autoBind from '../utils/autobind';
import AuthStore from '../stores/AuthStore';
import constants from '../styles/constants';
import { login } from '../utils/google';
import t from '../utils/gettext';

const RaisedButton = mui.RaisedButton;
const StylePropable = mui.Mixins.StylePropable;

@decorate(StylePropable)
@decorate(autoBind(StylePropable))
class LoginForm extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: false,
        };
    }

    _handleTouchTap = this._handleTouchTap.bind(this);
    _handleTouchTap(event) {
        event.preventDefault();
        this.setState({loading: true});
        login().then((details) => {
            this.props.authenticate(AuthStore.backends.GOOGLE, details.code);
            this.setState({loading: false});
        });
    }

    _getStyles() {
        return {
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
            },
            text: {
                color: constants.colors.lightText,
            },
        };
    }

    render() {
        const styles = this._getStyles();
        return (
            <div style={styles.container} className="row">
                <section className="col-sm-offset-4 col-sm-4">
                    <div className="row center-xs">
                        <h1 style={styles.text}>{ t('circle') }</h1>
                    </div>
                    <div className="row center-xs">
                        <h2 style={styles.text}>{ t('know the people you work with.') }</h2>
                    </div>
                    <div className="row center-xs">
                        <RaisedButton
                            label={`${ t('START USING CIRCLE') }`}
                            style={styles.button}
                            labelStyle={styles.label}
                            primary={true}
                            onTouchTap={this._handleTouchTap}
                            disabled={this.state.loading}
                        />
                    </div>
                </section>
            </div>
        );
    }

}

export default LoginForm;
