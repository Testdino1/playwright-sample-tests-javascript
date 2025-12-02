# Ecommerce-demo-test-playwright

Automated end-to-end tests for Ecommerce Demo store using [Playwright](https://playwright.dev/).

---

## Project Structure

- `pages/` — Page Object Models
- `tests/` — Test specifications
- `playwright.config.js` — Playwright configuration
- `playwright-report/` — HTML and JSON test reports
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

If you haven't installed browsers yet:
```sh
npx playwright install
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

## Reports

Reports are generated in `playwright-report/`. When integrating with Testdino, ensure both HTML and JSON reporters are enabled in `playwright.config.js`.

Example reporter configuration:
```js
reporter: [
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['json', { outputFile: './playwright-report/report.json' }],
]
```

---

## Testdino Integration

[Testdino](https://testdino.com/) enables cloud-based Playwright reporting.

### Local Execution

After your tests complete and the report is generated in `playwright-report`, upload it to Testdino:



Replace the token above with your own Testdino API key.

See all available commands:
```sh
npx tdpw --help
```

---

## CI/CD Pipeline Integration

### GitHub Actions

Add the following step to your workflow after tests and report generation:



Ensure your API key is correctly placed in the command.

---

## Continuous Integration

Automated test runs and report merging are configured in `.github/workflows/test.yml`.

---

## Contributing

Pull requests and issues are welcome!

---

## License

