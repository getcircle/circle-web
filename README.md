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
- `open http://local.circle-web.divshot.io:9110/`

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
