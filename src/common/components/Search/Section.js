
class Section {

    constructor(items, title = '', initialHighlightedIndex = null, factoryFunction) {
        this.title = title;
        this._items = items;
        this.initialHighlightedIndex = initialHighlightedIndex;
        if (typeof factoryFunction === 'function') {
            this.factoryFunction = factoryFunction;
        } else {
            this.factoryFunction = (item) => item;
        }
    }

    getFactoryArguments(item) {
        return [item];
    }

    getItems(maxItems) {
        if (this._items === undefined || this._items === null) {
            return null;
        }

        const noMax = maxItems === undefined || maxItems === null;
        const items = [];
        this._items.forEach((item, index) => {
            if (noMax || index < maxItems) {
                // TODO verify this isn't called in a way that would slow us down
                const searchResult = this.factoryFunction(...this.getFactoryArguments(item));
                if (searchResult) {
                    items.push(searchResult);
                }
            }
        });
        return items;
    }

    getNumberOfItems(maxItems) {
        if (this._items) {
            return this._items.slice(0, maxItems).length;
        }
        return 0;
    }

    hasItems() {
        return this._items && this._items.length > 0;
    }

}

export default Section;
