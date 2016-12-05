import { merge } from 'lodash';
import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';
import InternalPropTypes from './InternalPropTypes';

class DetailSection extends CSSComponent {

    static propTypes = {
        firstCard: PropTypes.element,
        footer: PropTypes.element,
        secondCard: PropTypes.element,
    }

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
    }

    styles() {
        return this.css({
            largerDevice: this.context.device.largerDevice,
            missingCard: !this.props.firstCard || !this.props.secondCard,
        });
    }

    classes() {
        const common = {
            Card: {
                className: 'col-xs-12 col-sm-6 col-md-6 col-lg-6',
                style: {
                    paddingLeft: 0,
                    paddingRight: 0,
                },
            },
        };
        return {
            default: {
                FirstCard: {
                    ...common.Card,
                },
                SecondCard: merge({
                    style: {
                        marginTop: 12,
                    },
                }, common.Card),
            },
            'largerDevice': {
                FirstCard: merge({
                    style: {
                        borderRadius: '3px 0px 0px 3px',
                    },
                }),
                SecondCard: merge({
                    style: {
                        marginTop: 0,
                        borderRadius: '0px 3px 3px 0px',
                        borderLeft: '1px solid rgba(0, 0, 0, .1)',
                    },
                }, common.Card),
            },
            'missingCard': {
                FirstCard: {
                    className: 'col-xs',
                },
                SecondCard: {
                    className: 'col-xs',
                },
            },
        };
    }

    render() {
        const {
            firstCard,
            footer,
            secondCard,
            ...other,
        } = this.props;
        let first, second;
        if (firstCard) {
            first = React.cloneElement(firstCard, this.styles().FirstCard);
        }
        if (secondCard) {
            second = React.cloneElement(secondCard, this.styles().SecondCard);
        }
        return (
            <section {...this.props} className="row">
                {first}
                {second}
                {footer}
            </section>
        );
    }

}

export default DetailSection;
