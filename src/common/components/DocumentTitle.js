import { default as ReactDocumentTitle} from 'react-document-title';
import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class DocumentTitle extends CSSComponent {

    static propTypes = {
        title: PropTypes.string,
    }

    static defaultProps = {
        title: '',
    }

    static rewind() {
        return ReactDocumentTitle.rewind();
    }

    getTitle() {
        const {
            title,
        } = this.props;

        const finalTitle = (title ? `${title}  \u2013  ` : '') + 'Luno';
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
