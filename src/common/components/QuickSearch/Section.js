
class Section {

    constructor(items, title = '', initialHighlightedIndex = null) {
        this.title = title;
        this._items = items;
        this.initialHighlightedIndex = initialHighlightedIndex;
    }

    getItems(maxItems) {
        if (this._items) {
            return this._items.slice(0, maxItems);
        };
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
