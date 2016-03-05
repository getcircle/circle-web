import Section from '../Search/Section';

class SelectableSection extends Section {

    constructor(items, title = '', initialHighlightedIndex = null, factoryFunction, selectedCollectionIds, muiTheme) {
        super(items, title, initialHighlightedIndex, factoryFunction)
        this._selectedCollectionIds = selectedCollectionIds;
        this._muiTheme = muiTheme;
    }

    getFactoryArguments(item) {
        return [item, this._selectedCollectionIds, this._muiTheme];
    }

}

export default SelectableSection;
