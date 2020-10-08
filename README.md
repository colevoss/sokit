# Typescript Node Boilerplate

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## What

This is a template repo that will get you writing a TypeScript Node application
in not time. Click [here](https://github.com/colevoss/typescript-node-boilerplate/generate) to create a new repo with this template.

## How

Use this template by clicking [here](https://github.com/colevoss/typescript-node-boilerplate/generate)
and cloning your new repository

### Testing

```bash
npm test
```

Testing has been set up using [jest](https://jestjs.io/) and [ts-jest](https://github.com/kulshekhar/ts-jest).
Run tests with `npm test`. Coverage is turned on and thresholds set to 80%. Test files must be named
`<name>.test.ts` and placed in the `test` in the root of the project.

### Building

```bash
npm run build
```

This will clean the `build` directory and recompile the TypeScript code into the `build` directory.

### Git Hooks

#### Pre-Commit

##### Prettier

Prettier is ran against all `.ts`, `.js`, `.md`, `.json`, and `.yaml` files with the `--write` flag, so files will be corrected and re-staged.

##### Tests

All tests are ran before the commit is initialized.

#### Pre-Commit Message

This project is set up with [commitizen](https://github.com/commitizen/cz-cli). To commit changes,
stage your changes with `git add`. Then initialize the commit with `git commit` and you will be prompted
with the commitizen Conventional Changelog commit message options. Complete the prompts given by commitizen,
review your message in the default git commit message composer, and finally save. (Don't for get to push)

### CI/CD

#### Pull Requests

A Github Action is ran on every pull request creation and push to an open PR that will build, test, and
archive the test coverage as an artifact of the build.

## Todo

- [ ] Explain VSCode Launch Tasks
- [ ] Create master branch merge Github Action
- [ ] Explore linting options
