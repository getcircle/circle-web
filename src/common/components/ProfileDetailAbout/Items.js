import React, { PropTypes } from 'react';

import Colors from '../../styles/Colors';
import t from '../../utils/gettext';

import DetailSection from '../DetailSectionV2';

const Items = ({ items }, { muiTheme }) => {
    const styles = {
        container: {
            paddingBottom: 10,
        },
        label: {
            color: Colors.lightBlack,
            fontSize: '1.3rem',
            paddingLeft: 0,
        },
        value: {
            fontWeight: muiTheme.luno.fontWeights.bold,
            fontSize: '1.3rem',
            textAlign: 'right',
            color: Colors.black,
        },
    };

    const elements = [];
    for (let index in items) {
        const item = items[index];
        const element = (
            <li className="row between-xs" key={`profile-item-${index}`} style={styles.container}>
                <span className="col-xs" style={styles.label}>{item.key}</span>
                <span className="col-xs" style={styles.value}>{item.value}</span>
            </li>
        );
        elements.push(element);
    }

    return (
        <DetailSection title={t('Info')}>
            <ul>
                {elements}
            </ul>
        </DetailSection>
    );
};

Items.propTypes = {
    items: PropTypes.array.isRequired,
};

Items.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Items;
