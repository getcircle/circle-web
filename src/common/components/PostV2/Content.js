import { flow } from 'lodash';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import {
    detectCodeMarkdownAndAddMarkup,
    detectEmailsAndAddMarkup,
    detectHashtagsAndAddMarkup,
    detectLineBreaksAndAddMarkup,
    detectSingleLineCodeMarkdownAndAddMarkup,
    detectURLsAndAddMarkup,
    setTargetBlankOnAnchorTags,
} from '../../utils/string';

import { Divider } from 'material-ui';

const Content = ({ post }) => {
    const styles = {
        divider: {
            marginTop: 50,
            marginBottom: 30,
        },
        root: {
            paddingTop: 35,
        },
    };
    const detectPatternsAndAddMarkup = flow(
        setTargetBlankOnAnchorTags,
        detectCodeMarkdownAndAddMarkup,
        detectURLsAndAddMarkup,
        detectEmailsAndAddMarkup,
        detectHashtagsAndAddMarkup,
        detectSingleLineCodeMarkdownAndAddMarkup,
        detectLineBreaksAndAddMarkup,
    );
    const finalContent = detectPatternsAndAddMarkup(post.content);
    return (
        <div>
            <div
                className="luno-editor"
                dangerouslySetInnerHTML={{__html: finalContent}}
                style={styles.root}
            />
            <Divider style={styles.divider} />
        </div>
    );
};

Content.propTypes = {
    post: PropTypes.instanceOf(services.post.containers.PostV1),
};

export default Content;
