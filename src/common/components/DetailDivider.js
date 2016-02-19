import React, { PropTypes } from 'react';

import { Divider } from 'material-ui';

const DetailDivider = ({ style, ...other }) => {
    style = {
        marginTop: 5,
        marginBottom: 20,
        ...style,
    };
    return <Divider style={style} {...other} />;
};

DetailDivider.propTypes = {
    style: PropTypes.object,
};

export default DetailDivider;
