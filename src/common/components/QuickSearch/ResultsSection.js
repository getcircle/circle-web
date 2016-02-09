import * as itemFactory from './factories';
import Section from './Section';

/* TODO:
 * find a place for:
 * searchResult = this.trackTouchTap(searchResult);
 */

class ResultsSection extends Section {

    constructor(items, title = '') {
        super(items, title);
    }

    _getItems(maxItems) {
        const noMax = maxItems === undefined || maxItems === null;
        const items = [];
        this._items.forEach((result, index) => {
            if (noMax || index < maxItems) {
                let searchResult = null;
                if (result.profile) {
                    searchResult = itemFactory.getProfileResult(
                        result.profile,
                        index,
                        result.highlight,
                    );
                } else if (result.team) {
                    searchResult = itemFactory.getTeamResult(
                        result.team,
                        index,
                        result.highlight,
                    );
                } else if (result.location) {
                    searchResult = itemFactory.getLocationResult(
                        result.location,
                        index,
                        result.highlight,
                    );
                } else if (result.post) {
                    searchResult = itemFactory.getPostResult(
                        result.post,
                        index,
                        result.highlight,
                    );
                }
                items.push(searchResult);
            }
        });
        return items;
    }

    getItems(maxItems) {
        if (this._items === undefined || this._items === null) {
            return null;
        } else {
            return this._getItems(maxItems);
        }
    }

}

export default ResultsSection;
