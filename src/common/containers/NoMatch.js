import React from 'react';

import t from '../utils/gettext';

const NoMatch = () => {
    const styles = {
        container: {
            paddingTop: 50,
        },
        text: {
            fontSize: '1.6rem',
        },
    };
    return (
        <section className="wrap">
            <div className="row center-xs" style={styles.container}>
                <span style={styles.text}>{t('Not found!')}</span>
            </div>
        </section>
    );
};

export default NoMatch;
