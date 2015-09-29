import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class DetailSection extends CSSComponent {

    static propTypes = {
        firstCard: PropTypes.element,
        footer: PropTypes.element,
        largerDevice: PropTypes.bool.isRequired,
        secondCard: PropTypes.element,
    }

    styles() {
        return this.css({
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
                SecondCard: this.merge.recursive({
                    style: {
                        marginTop: 12,
                    },
                }, common.Card),
            },
            'largerDevice-true': {
                FirstCard: this.merge.recursive({
                    style: {
                        borderRadius: '3px 0px 0px 3px',
                    },
                }),
                SecondCard: this.merge.recursive({
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
