'use strict';
const path = require('path');
const fs = require('fs');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const rootPkg = require('../package.json');

const jestGenerator = path.join(__dirname, '../generators/app');

describe('generator-jest:app', function () {
  it('generates for jsdom', function () {
    return helpers.run(jestGenerator)
      .withPrompts({testEnvironment: 'jsdom'})
      .toPromise()
      .then(function () {
        assert.jsonFileContent('package.json', {
          scripts: {
            test: 'jest'
          },
          devDependencies: {
            jest: rootPkg.devDependencies.jest,
            'jest-cli': rootPkg.devDependencies['jest-cli']
          }
        });
      });
  });

  it('generates for node', function () {
    return helpers.run(jestGenerator)
      .withPrompts({testEnvironment: 'node'})
      .toPromise()
      .then(function () {
        assert.jsonFileContent('package.json', {
          scripts: {
            test: 'jest'
          },
          devDependencies: {
            jest: rootPkg.devDependencies.jest,
            'jest-cli': rootPkg.devDependencies['jest-cli']
          },
          jest: {
            testEnvironment: 'node'
          }
        });
      });
  });

  it('allows selecting environment through options', function () {
    return helpers.run(jestGenerator)
      .withOptions({testEnvironment: 'node'})
      .toPromise()
      .then(function () {
        assert.jsonFileContent('package.json', {
          jest: {
            testEnvironment: 'node'
          }
        });
      });
  });

  it('is non-destructive of current scripts', function () {
    return helpers.run(jestGenerator)
      .withPrompts({testEnvironment: 'node'})
      .inTmpDir(function () {
        fs.writeFileSync('package.json', JSON.stringify({
          scripts: {
            test: 'eslint'
          }
        }));
      })
      .toPromise()
      .then(function () {
        assert.jsonFileContent('package.json', {
          scripts: {
            test: 'eslint && jest'
          }
        });
      });
  });

  it('does not duplicates pre-existing jest commands', function () {
    return helpers.run(jestGenerator)
      .withPrompts({testEnvironment: 'node'})
      .inTmpDir(function () {
        fs.writeFileSync('package.json', JSON.stringify({
          scripts: {
            test: 'eslint && jest --coverage'
          }
        }));
      })
      .toPromise()
      .then(function () {
        assert.jsonFileContent('package.json', {
          scripts: {
            test: 'eslint && jest --coverage'
          }
        });
      });
  });
});
