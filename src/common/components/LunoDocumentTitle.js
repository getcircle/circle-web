import DocumentTitle from 'react-document-title';
import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

class LunoDocumentTitle extends CSSComponent {

    static propTypes = {
        loading: PropTypes.bool,
        title: PropTypes.string.isRequired,
    }

    static defaultProps = {
        loading: false,
    }

    static rewind() {
        return DocumentTitle.rewind();
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
            <DocumentTitle
                title={this.getTitle()}
            >
                {this.renderChildren()}
            </DocumentTitle>
        );
    }

}

export default LunoDocumentTitle;
