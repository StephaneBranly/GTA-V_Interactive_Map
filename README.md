# Description

This template project is live at https://sebranly.github.io/template-ts/

This project allows you to quickly spin up a React + TypeScript based project, hosted on GitHub Pages under the URL: `https://<github username>.github.io/<repo name>`.

The idea is having two branches:

- `main` for development
- `master` for automated publishing via `gh-pages` package

More details:

- Pull Requests get created from featured branches that can be merged to `main`
- `npm run deploy` command can be run from a synced up `main` branch in order to automatically publish to GitHub Pages
  - published files are the output created from `gh-pages`, available at `master` branch that should not be edited manually.

# Template TODOs

- [ ] Create a new local folder with your new project name (from scratch with `mkdir` for instance)
- [ ] In `template-ts` folder, run `rm -rf node_modules` to delete installed packages
- [ ] Copy this template folder locally onto the new project folder
- [ ] Verify latest node and npm
- [ ] Create a repo on GitHub
  - [ ] Add a different license if applicable
- [ ] Sync up local and remote by picking the right license (template default is MIT with my full name)
- [ ] On GitHub go to Settings > Pages and activate it for `master`
  - [ ] A GitHub Action should be queued for publishing the website live
- [ ] Go back to `main`
- [ ] Favicon: use a website like https://favicon.io/favicon-generator/ and edit `manifest.json` as needed
- [ ] Edit the metadata for social media sharing and other files
  - [ ] The project should not contain any of these strings anymore:
    - [ ] `placeholder`
    - [ ] `template`
    - [ ] `sebranly`
    - [ ] `Sebastien`
    - [ ] `Branly`

## Not supported

- Creation of `CNAME` for custom domain

# Last steps...

Once the project is created thanks to the template:

- [ ] remove `README.md` sections above
- [ ] edit section below (search for `sebranly` and `template` strings)
- [ ] your new `README.md` file for your own website is ready!

## Development

### Setup

- Clone the repository with `git clone git@github.com:sebranly/template-ts.git`
- Go into the repository (e.g. with `cd`)
- Make sure you use correct node (`node -v`) and npm (`npm -v`) versions
- Run `npm ci` to install the dependencies

### Start

- To run it locally, run `npm run start`, it has hot reloading
- To run the test suite (no need to run command above), run `npm run test`

### Deploy

- Commit and push your changes to `main` branch, or create a merge request as a PR from your clone to this project's `main` branch
- Make sure to have followed the following. If not, create a new PR.
  - increase the `WEBSITE_VERSION` from `src/constants/general.ts` file, by following semver
    - MAJOR version when you make incompatible API changes,
    - MINOR version when you add functionality in a backwards compatible manner, and
    - PATCH version when you make backwards compatible bug fixes.
- Confirm that test suite passes with `npm run test`
- Then run `npm run deploy`
- Finally create a new release for this version on [GitHub Releases page](https://github.com/sebranly/template-ts/releases) by adding the changelog
