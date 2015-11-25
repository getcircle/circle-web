import { PropTypes } from 'react';
import { services } from 'protobufs';

function enumValues(enumType) {
    return Object.keys(enumType).map(key => enumType[key]);
}

export default {
    ProfileV1: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    SearchAttributeV1: PropTypes.oneOf(
        enumValues(services.search.containers.search.AttributeV1)
    ),
    SearchCategoryV1: PropTypes.oneOf(
        enumValues(services.search.containers.search.CategoryV1)
    ),
};
