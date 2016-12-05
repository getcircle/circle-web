import React, { PropTypes } from 'react';

import Colors from '../styles/Colors';
import FontWeights from '../styles/FontWeights';

import DetailSection from './DetailSectionV2';
import RoundedButton from './RoundedButton';

const DetailQuestionSection = (props) => {
    const {
        buttonText,
        onTouchTap,
        questionText,
        header,
    } = props;
    const styles = {
        text: {
            fontSize: '1.8rem',
            color: Colors.lightBlack,
            lineHeight: '2.8rem',
        },
        button: {
            marginTop: 10,
            lineHeight: '2.8rem',
        },
        label: {
            fontSize: '0.9rem',
            fontWeight: FontWeights.black,
        },
    };
    return (
        <DetailSection>
            {header}
            <div style={styles.text}>{questionText}</div>
            <RoundedButton
                label={buttonText}
                labelStyle={styles.label}
                onTouchTap={onTouchTap}
                style={styles.button}
            />
        </DetailSection>
    );
};

DetailQuestionSection.propTypes = {
    buttonText: PropTypes.string.isRequired,
    header: PropTypes.node,
    onTouchTap: PropTypes.func,
    questionText: PropTypes.string.isRequired,
};

export default DetailQuestionSection;
