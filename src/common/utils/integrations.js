import { services } from 'protobufs';

export const IntegrationString = {
    SLACK: 'slack',
}

export function providerForIntegration(integration) {
    switch (integration) {
        case IntegrationString.SLACK:
            return services.user.containers.IdentityV1.ProviderV1.SLACK;
            break;
    }
}
