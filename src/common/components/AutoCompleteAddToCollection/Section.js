import Section from '../Search/Section';

class SelectableSection extends Section {

    constructor(items, title = '', initialHighlightedIndex = null, factoryFunction, selectedCollectionIds) {
        super(items, title, initialHighlightedIndex, factoryFunction)
        this._selectedCollectionIds = selectedCollectionIds;
    }

    getFactoryArguments(item) {
        return [item, this._selectedCollectionIds];
    }

}

export default SelectableSection;
