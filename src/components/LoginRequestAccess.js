import mui from 'material-ui';
import React, { PropTypes } from 'react';

import { fontWeights } from '../constants/styles';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

const { RaisedButton } = mui;

class LoginRequestAccess extends CSSComponent {

    static propTypes = {
        onRequestAccess: PropTypes.func.isRequired,
    }

    state = {
        canRequestAccess: true,
    }

    classes() {
        return {
            default: {
                button: {
                    height: '50px',
                    width: '100%',
                },
                header: {
                    fontSize: '18px',
                    lineHeight: '22px',
                    ...fontWeights.light,
                },
                headerDiv: {
                    marginBottom: '10%',
                },
            },
        };
    }

    getLabel() {
        if (this.state.canRequestAccess) {
            return t('Request Access');
        } else {
            return t('Access Requested');
        }
    }

    render() {
        return (
            <section>
                <div is="headerDiv">
                    <span is="header">{t('You don\'t have access to Luno yet.')}</span>
                </div>
                <div className="col-xs-12">
                    <RaisedButton
                        disabled={!this.state.canRequestAccess}
                        is="button"
                        label={this.getLabel()}
                        onTouchTap={() => {
                            this.setState({canRequestAccess: false});
                            this.props.onRequestAccess()
                        }}
                        primary={true}
                    />
                </div>
            </section>
        );
    }

}

export default LoginRequestAccess;
