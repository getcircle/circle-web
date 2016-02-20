import { CircularProgress } from 'material-ui';
import React from 'react';

import InternalPropTypes from './InternalPropTypes';

const CenterLoadingIndicator = (props, { device: { mounted }}) => {
    const styles = {
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
    };
    let indicator;
    if (mounted) {
        indicator = <CircularProgress mode="indeterminate" size={1} />;
    }
    return (
        <div style={styles.container}>
            <div style={styles.innerDiv}>
                {indicator}
            </div>
        </div>
    );
};

CenterLoadingIndicator.contextTypes = {
    device: InternalPropTypes.DeviceContext.isRequired,
};

export default CenterLoadingIndicator;
