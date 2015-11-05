import { services } from 'protobufs';

class PostFactory {

    constructor() {
        this._post = new services.post.containers.PostV1({
            /*eslint-disable camelcase*/
            title: 'This is test title of a post',
            content: 'This is test content of a post',
            by_profile: new services.profile.containers.ProfileV1({
                first_name: 'Ravi',
                last_name: 'Rani',
                full_name: 'Ravi Rani',
                title: 'Co-founder @ Luno',
                image_url: 'https://dev-lunohq-media.s3.amazonaws.com/organizations/acme.png',
            }),
            changed: '2015-11-05 01:09:00.099535+00',
            /*eslint-enable camelcase*/
        });
    }

    getPost() {
        return this._post;
    }

    getPostWithContent(content) {
        return Object.assign({}, this._post, {
            content: content,
        });
    }
}

export default new PostFactory();
