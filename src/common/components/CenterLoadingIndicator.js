import { CircularProgress } from 'material-ui';
import React from 'react';

import CSSComponent from './CSSComponent';

class CenterLoadingIndicator extends CSSComponent {

    classes() {
        return {
            'default': {
                container: {
                    display: 'table',
                    height: '100%',
                    left: 0,
                    minHeight: '100vh',
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                },
                innerDiv: {
                    display: 'table-cell',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                },
            },
        }
    }


    render() {
        return (
            <div style={this.styles().container}>
                <div style={this.styles().innerDiv}>
                    <CircularProgress mode="indeterminate" size={1} />
                </div>
            </div>
        );
    }
}

export default CenterLoadingIndicator;
