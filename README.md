# Ecommerce-demo-test-playwright

Automated end-to-end tests for Ecommerce Demo store using [Playwright](https://playwright.dev/).

---
<p align="left">
  <a href="https://github.com/testdino-hq/playwright-sample-tests-javascript/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/testdino-hq/playwright-sample-tests-javascript/test.yml?branch=main&label=CI&logo=none" alt="CI Status"></a>
  <a href="https://www.npmjs.com/package/@testdino/playwright"><img src="https://img.shields.io/npm/v/%40testdino%2Fplaywright?color=blue" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@testdino/playwright"><img src="https://img.shields.io/npm/unpacked-size/%40testdino%2Fplaywright?color=orange" alt="install size"></a>
  <a href="https://github.com/testdino-hq/playwright-sample-tests-javascript/blob/main/LICENCE"><img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="MIT License"></a>
</p>


## Project Structure

- `pages/` — Page Object Models
- `tests/` — Test specifications
- `playwright.config.js` — Playwright configuration
- `playwright-report/` — HTML test reports
- `.github/workflows/test.yml` — CI/CD pipeline

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [npm](https://www.npmjs.com/)

---

## Installation

```sh
npm install
```

---

## Local Test Execution

Run all tests:
```sh
npx playwright test
```

View the HTML report:
```sh
npx playwright show-report
```

---

## Testdino Integration

[Testdino](https://testdino.com/) enables cloud-based Playwright reporting with real-time streaming via the [`@testdino/playwright`](https://www.npmjs.com/package/@testdino/playwright) reporter.

The reporter is already configured in `playwright.config.js`:

```js
reporter: [
  ['@testdino/playwright', { token: process.env.TESTDINO_TOKEN }],
],
```

### Local Execution

Set your API token (from the TestDino dashboard) and run tests as usual — results stream to TestDino in real time:

```sh
export TESTDINO_TOKEN=YOUR_API_TOKEN
npx playwright test
```

You can also put the token in `.env` (see `.env.example`); it is loaded automatically.

---

## CI/CD Pipeline Integration

### GitHub Actions

Add `TESTDINO_TOKEN` as a repository secret and expose it to the test step:

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    TESTDINO_TOKEN: ${{ secrets.TESTDINO_TOKEN }}
```

---

## Continuous Integration

Automated test runs and report merging are configured in `.github/workflows/test.yml`.

---

## Contributing

Pull requests and issues are welcome!

---

## License

