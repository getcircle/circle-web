import React, { PropTypes } from 'react';
import { Tabs, Tab } from 'material-ui';

import CSSComponent from './CSSComponent';

class TabBar extends CSSComponent {

    static propTypes = {
        style: PropTypes.object,
    }

    classes() {
        return {
            default: {
                footer: {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    bottom: 0,
                    left: 0,
                    position: 'fixed',
                    right: 0,
                },
                Tabs: {
                    style: {
                        width: '100%',
                    },
                },
            },
        };
    }

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return (
            <footer {...other} className="row" style={{...this.styles().footer, ...style}}>
                <Tabs is="Tabs">
                    <Tab is="tab" label="Search" />
                    <Tab is="tab" label="Profile" />
                </Tabs>
            </footer>
        );
    }

}

export default TabBar;
