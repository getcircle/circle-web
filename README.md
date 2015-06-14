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
- `npm run-script open`

## Dev Environment

SublimeText 3

- Install "BetterCoffeeScript" and "ReactJS"
- We are going to use `.cjsx` files everywhere
- To make sure the right syntax show up open a cjsx file and click "View" -> "Syntax" -> "Open all with current extension as..." -> "ReactJS" -> "Coffeescript"

Development
===========

## Start up the watcher while developing

- Run `gulp watch` to constantly compile js and scss changes

## Architecture

- We are mostly following Flux but adding in routing

## Unit Testing

- We are using Jest by facebook
- Run `npm test`

## Styling

- We are using scss
- We are following smacss mostly
- We are using the BEM naming convention

Notes
========

- Some build/watcher optimizations to make would be to make reactjs load separately. Most of the 2second build is reactjs getting bundled in.

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

__mocks__
- from Facebook's [jest](https://github.com/facebook/jest) testing module
  - jest is a mocking library that auto mocks all modules, allowing you to test specific components at a time
- any __mocks__ directory tell jest that we want to manually mock the module with the given code
  - see [ManualMocks](https://github.com/facebook/jest/blob/master/docs/ManualMocks.md) for more information.

dist/
- where the coffeescript/jsx and sccss code is compiled to
- this should be referenced within any html page. `src` should never be accessed.

guplfile.coffee
- file telling [gulp](https://github.com/gulpjs/gulp) to load tasks from a `tasks` directory
  - this prevents us from having some huge file defining all of our tasks

tasks/
- directory with all of our gulp tasks
- each file registers a `gulp.task` with a specific name.
  - we should try and keep 1 task per file, but thats not required

package.json
- https://docs.npmjs.com/files/package.json

server.coffee
- run a local server to serve the static files

src/
- contains all of our cjsx and scss files

## Source (src) Structure

app.cjsx
- instantiates the react app

actions/
- contains convenience wrappers around dispatching actions for different parts of our application domains
- contains flux "actions" for different parts of our application domains
  - flux actions:
    - convenience wrappers around dispatching actions to
    - wrappers around flux "dispatcher"
- contains "actions" which are wrappers around registering flux "actions" to

actions/routing/
- directory that contains the routes and route actions for specific domains of the application.
- a route action is an action that renders a react component
- a route is a mapping of a url to a route action
- routes and route actions should be added with a subdirectory and two files:
  - actions.coffee
    - map of action functions that render react components
  - routes.coffee
    - function which registers all of the routes with the specified router

components/
- contains the react components

constants/action_types.coffee
- action_type constants that are used to help the store identify what should be done when an action is received

constants/route_names.coffee
- mapping of route names to the url path

dispatcher/
- the default flux dispatcher

stores/
- flux stores
- we should have a store for each "domain" (service) within our application
