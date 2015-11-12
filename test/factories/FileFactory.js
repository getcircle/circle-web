import faker from 'faker';
import { services } from 'protobufs';

class FileFactory {

    constructor() {
        this._file = new services.file.containers.FileV1({
            /*eslint-disable camelcase*/
            id: faker.random.uuid(),
            by_profile_id: faker.random.uuid(),
            organization_id: faker.random.uuid(),
            source_url: faker.image.imageUrl(),
            content_type: 'image/png',
            created: faker.date.past().toString(),
            name: faker.lorem.words().join(''),
            /*eslint-enable camelcase*/
        });
    }

    getFile(fileId) {
        if (fileId) {
            return Object.assign({}, this._file, {
                id: fileId,
            });
        }

        return this._file;
    }
}

export default new FileFactory();
