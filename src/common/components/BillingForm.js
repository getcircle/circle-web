import { connect } from 'react-redux';
import { RaisedButton } from 'material-ui';
import React, { PropTypes } from 'react';
import StripeCheckout from 'react-stripe-checkout';

import { fontColors, fontWeights } from '../constants/styles';
import Logo from '../images/Logo.png';
import { storeToken } from '../actions/billing';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

@connect()
class BillingForm extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    }

    classes() {
        return {
            default: {
                button: {
                    width: '100%',
                    backgroundColor: 'rgb(0, 201, 255)',
                    height: 50,
                    maxWidth: 400,
                },
                container: {
                    paddingTop: '15%',
                },
                label: {
                    lineHeight: '50px',
                    fontSize: 18,
                    ...fontWeights.light,
                },
                header: {
                    fontSize: 36,
                    paddingBottom: 20,
                    ...fontColors.white,
                },
                section: {
                    marginLeft: 20,
                    marginRight: 20,
                },
                subHeader: {
                    fontSize: 26,
                    paddingBottom: 70,
                    ...fontColors.white,
                },
            }
        }
    }

    render() {
        return (
            <div className="row" style={this.styles().container}>
                <section className="col-xs" style={this.styles().section}>
                    <div>
                        <div className="row center-xs">
                            <h1 style={this.styles().header}>luno</h1>
                        </div>
                        <div className="row center-xs">
                            <h2 style={this.styles().subHeader}>{t('organizing your company\'s knowledge')}</h2>
                        </div>
                        <div className="row center-xs">
                            <StripeCheckout
                                allowRememberMe={false}
                                image={Logo}
                                name="Luno Inc."
                                panelLabel="Submit Card"
                                stripeKey="pk_live_H2CGTLZJyyoqGBh2rs4wYaPF"
                                token={(token) => this.props.dispatch(storeToken(token))}
                            >
                                <RaisedButton
                                    label={`${ t('ENTER YOUR CREDIT CARD') }`}
                                    labelStyle={this.styles().label}
                                    primary={true}
                                    style={this.styles().button}
                                />
                             </StripeCheckout>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

}

export default BillingForm;
