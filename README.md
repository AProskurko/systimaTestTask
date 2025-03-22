# Systima E2E Test Project

This repository contains end-to-end tests for the Systima application, implemented using Playwright with TypeScript.

## Project Overview

This project implements automated end-to-end tests for the Systima application, focusing on key user workflows:

- Authentication (login scenarios)
- Purchase creation
- Contact management

The tests are written using Playwright and TypeScript to ensure robust, maintainable test coverage.

## Prerequisites

Node.js (LTS version recommended)
PNPM package manager (v10.6.5 or later)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/AProskurko/systimaTestTask.git
cd systimaTestTask
npm install -g pnpm 
pnpm install
```

Install Playwright browsers:

```bash
pnpm exec playwright install --with-deps
```

## Running Tests

To run all tests:

```bash
pnpm test
```

This command executes the test script defined in package.json, which runs Playwright tests across three browsers:

- Chrome
- Firefox
- WebKit

The test suite contains a total of 15 tests (5 test scenarios running in 3 different browsers).

## Test Structure

The tests are organized according to the scenarios outlined in the assignment:

1. Authentication Tests
- Successful login
- Failed login with invalid credentials

2. Purchase Creation Tests
- Navigation to booking form
- Form completion
- Submission and validation

3. Invoice Validation Tests
- Duplicate invoice number handling

4. Contact Management Tests
- Contact creation validation (empty fields)
- Successful contact creation

## Test Environment

Tests are configured to run against the Systima staging environment:

- URL: https://app.staging.systima.no/systimaas7/dashboard
- Test credentials are configured in the test files

## Continuous Integration

This project includes GitHub Actions workflow configuration in `.github/workflows/playwright.yml` that:

1. Sets up the environment with Node.js and PNPM
2. Installs dependencies
3. Installs Playwright browsers
4. Runs all tests
5. Uploads test reports as artifacts

CI tests are triggered on:

- Pushes to the main branch
- Pull requests targeting the main branch

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
