import CSSComponent from  './CSSComponent';

export default class FormField extends CSSComponent {

    styles() {
        return this.css({
            'showError': this.showError(),
        });
    }

    showError() {
        const { invalid, touched } = this.props;
        return touched && invalid;
    }
}
