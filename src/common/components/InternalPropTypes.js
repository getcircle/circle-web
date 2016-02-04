import { PropTypes } from 'react';
import { services } from 'protobufs';
import { Sizes } from '../decorators/resizable';

function enumValues(enumType) {
    return Object.keys(enumType).map(key => enumType[key]);
}

const InternalPropTypes = {
    DescriptionV1: PropTypes.instanceOf(services.common.containers.description.DescriptionV1),
    DeviceContext: PropTypes.shape({
        deviceSize: PropTypes.oneOf(Object.values(Sizes)).isRequired,
        largerDevice: PropTypes.bool.isRequired,
        mobileOS: PropTypes.bool.isRequired,
    }),
    LocationV1: PropTypes.instanceOf(services.organization.containers.LocationV1),
    OrganizationV1: PropTypes.instanceOf(services.organization.containers.OrganizationV1),
    PostV1: PropTypes.instanceOf(services.post.containers.PostV1),
    ProfileV1: PropTypes.instanceOf(services.profile.containers.ProfileV1),
    SearchAttributeV1: PropTypes.oneOf(
        enumValues(services.search.containers.search.AttributeV1)
    ),
    SearchCategoryV1: PropTypes.oneOf(
        enumValues(services.search.containers.search.CategoryV1)
    ),
    TeamV1: PropTypes.instanceOf(services.organization.containers.TeamV1),
    URLContext: PropTypes.shape({
        raw: PropTypes.string.isRequired,
        protocol: PropTypes.oneOf(['http:', 'https:']).isRequired,
        host: PropTypes.string.isRequired,
        subdomain: PropTypes.string.isRequired,
    }),
};
InternalPropTypes.AuthContext = PropTypes.shape({
    location: InternalPropTypes.LocationV1,
    organization: InternalPropTypes.OrganizationV1,
    profile: InternalPropTypes.ProfileV1,
});
export default InternalPropTypes;
