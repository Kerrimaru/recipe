# Recipe Hole

https://recipe-hole.firebaseapp.com/

I started **Recipe Hole** after my mom sent me a **screenshot** of an **email** of a recipe she thought I might like to try. This was not very conducive to actually reading the recipe, and if I had been able to read the recipe and enjoyed making it, how would I save it in that form? Or ever find it again in my message history? After googling the recipe, I was bombarded by content-farm recipe sites, serving up mostly ads and tracking my every move, and just generally making it too unpleasant to use to make any recipe.

My idea is to make an app simple enough for my mom to use, for us to share recipes together, in a hopefully visually pleasing way! I want my app to be simple, and to cut to the chase when it comes to following a recipe, but also functional and pleasant to use.

Most importantly tho, it also doubles of course as my playground for developing my development skills!
My site is currently in a state where it is functional (MVP), and I use it on a regular basis (although my mom still has yet to really pick up on it). As for the rest, I enjoy working away on it whenever I get the chance.

## Already implemented:

- user **authentication,** realtime **database,** and hosting using **firebase**
- user can **tag** recipes as favourites or to-do, and filter this way
- simple **search** functionality
- add **notes** and **dates** to recipes

## Works in progress and To Dos:

- include **testing**
- make into a **progressive web app**
- improvements to screen size **responsiveness**
- implement more **filters** (and properly)
- implement actual **tags** functionality
- user settings
- constant **ui** changes and **refactoring**

## Pipe dreams:

- create my own **text editor**, and improvements to recipe methods display
- **notifications** of new recipes and messaging between users
- implement **canvas** to allow for more 'real' feeling notes (in book margin, for example)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

# to serve and test PWA locally

Run `http-server-spa dist/recipes/ index.html 8080`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

# deploy

Run `ng deploy`
