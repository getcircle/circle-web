import React, { PropTypes } from 'react';

import constants from '../styles/constants';

import BillingForm from '../components/BillingForm';
import CSSComponent from '../components/CSSComponent';

class Billing extends CSSComponent {

    static propTypes = {
        authError: PropTypes.object,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }),
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.authenticated) {
            this.context.history.pushState(null, this.props.location.nextPathname || '/');
            return false;
        }
        return true;
    }

    classes() {
        return {
            default: {
                root: {
                    backgroundColor: constants.colors.background,
                    minHeight: '100vh',
                },
                wrap: {
                    marginBottom: 0,
                },
            }
        }
    }

    render() {
        return (
            <div style={this.styles().root}>
                <div className="wrap" style={this.styles().wrap}>
                    <BillingForm />
                </div>
            </div>
        );
    }
}

export default Billing;
