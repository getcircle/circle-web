Setup
=======

## Install

nvm

- `curl https://raw.githubusercontent.com/creationix/nvm/v0.24.1/install.sh | bash`
- `nvm install 0.10`
- `nvm use 0.10`, add this to your bash profile, we can try v0.12 later

npm global libs

- `npm install -g divshot`
- `npm install -g gulp`
- is that it? I think there are more

other global concerns

- you may need fb watchman or something that lets you listen to more files at some point

## Run

- Clone
- `npm install`
- `npm test`
- `sudo npm run-script setup-dns`
- `npm start`
- `npm run open`

Development
===========

## Start up the watcher while developing

- Run `npm start` to constantly compile js and scss changes

## Architecture

- We're using Redux which implements a similar unidirectional data flow to Flux

http://rackt.github.io/redux/
http://rackt.github.io/react-router/
https://github.com/rackt/react-redux

## Unit Testing

- We are using Mocha. To install, run `npm install -g mocha` once.
- Another dependency for writing tests is `iojs`. To install and set it as default, do the following once:
```
> nvm install iojs
> nvm alias default iojs
```
- Run `npm test` to run the tests.

http://mochajs.org/
http://rackt.github.io/redux/docs/recipes/WritingTests.html

## Styling

- We should use mostly inline styles and material-ui components when available.

http://material-ui.com/#/

App Structure
==============

## Routing

Routing is handled by Amazon's Route53. Serving the files is handled by divshot for the moment.

Currently we have two DNS records that serve www.circlehq.co.
- "A" DNS record that is an alias to an s3 static website
  - this just redirects to www.circlehq.co
- "CNAME" DNS record that points to circlehq.divshot.io

## Top Level Structure

index.html
- this is the entry point into to react application
- includes dist/app.css
- sets up the `js-content` div
  - this is the div where all of the react components will get rendered
- includes dist/app.js, which loads the react app

dist/
- where the coffeescript/jsx and sccss code is compiled to
- this should be referenced within any html page. `src` should never be accessed.

package.json
- https://docs.npmjs.com/files/package.json

server.js
- run a local server to serve the static files

src/
- contains all of our js and scss files

## Source (src) Structure

TODO
