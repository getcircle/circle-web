import { default as ReactDocumentTitle} from 'react-document-title';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

class DocumentTitle extends CSSComponent {

    static propTypes = {
        loading: PropTypes.bool,
        title: PropTypes.string,
    }

    static defaultProps = {
        loading: false,
        title: '',
    }

    static rewind() {
        return ReactDocumentTitle.rewind();
    }

    getTitle() {
        const {
            loading,
            title,
        } = this.props;

        let finalTitle;
        if (loading) {
            finalTitle = `${t('Loading')} \u2026`;
        } else {
            finalTitle = (title ? `${title}  \u2013  ` : '') + 'Luno';
        }

        return finalTitle;
    }

    renderChildren() {
        if (this.props.children) {
            return React.Children.only(this.props.children);
        } else {
            return null;
        }
    }

    render() {
        return (
            <ReactDocumentTitle
                title={this.getTitle()}
            >
                {this.renderChildren()}
            </ReactDocumentTitle>
        );
    }

}

export default DocumentTitle;
