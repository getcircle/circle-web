import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import DetailContent from './DetailContent';
import DetailSection from './DetailSectionV2';

const Explore = ({ children, count, noun }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;
    const text = count ? ` (${count})` : '';
    return (
        <DetailContent>
            <section className="row middle-xs">
                <h1 style={theme.h1}>{t(`${noun} ${text}`)}</h1>
            </section>
            <DetailSection dividerStyle={{marginBottom: 0}}>
                {children}
            </DetailSection>
        </DetailContent>
    );
};

Explore.propTypes = {
    count: PropTypes.number,
    noun: PropTypes.string.isRequired,
};

Explore.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Explore;
