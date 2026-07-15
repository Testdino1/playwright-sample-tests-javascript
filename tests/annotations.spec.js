// @ts-check
import { expect, test } from '@playwright/test';

/**
 * TestDino annotation scenarios — full coverage.
 * Exercises every recognized annotation type plus every metric shape/edge case
 * so the annotations panel rendering can be validated end to end.
 * Docs: https://docs.testdino.com/guides/playwright-test-annotations
 *
 * NOTE: this repo's playwright.config.js gives every project a `grep` filter
 * (@chromium/@firefox/@webkit/@android/@ios/@api). A test with no matching tag
 * runs in ZERO projects, so each test below carries a `{ tag: '@chromium' }`.
 */

/**
 * Format a metric annotation the way the TestDino UI does:
 * "<name>: <value> <unit> / <threshold>". Used to assert the value the panel
 * will show, so a shape change would fail here first.
 */
// @ts-ignore
function formatMetric({ name, value, unit, threshold }) {
  const u = unit ? ` ${unit}` : '';
  const t = threshold !== undefined && threshold !== null ? ` / ${threshold}` : '';
  return `${name}: ${value}${u}${t}`;
}

test.describe('TestDino Annotations', () => {
  // ───────────────────────────────────────────────────────────
  // 1. DECLARATION-TIME annotations (static tags on the test)
  // ───────────────────────────────────────────────────────────
  test(
    'Declaration-time annotations render all recognized types',
    {
      tag: '@chromium',
      annotation: [
        { type: 'testdino:priority', description: 'p0' }, // → filterable priority badge
        { type: 'testdino:feature', description: 'Navbar' }, // → plain text
        { type: 'testdino:owner', description: 'qa-team' }, // → filterable owner badge
        { type: 'testdino:link', description: 'https://jira.example.com/browse/QA-123' }, // → clickable link
        {
          type: 'testdino:context',
          description: 'Runs only against the staging tenant with seeded data.',
        }, // → long-text stacked row
        {
          type: 'testdino:flaky-reason',
          description: 'Known race on the auth redirect under load.',
        }, // → long-text stacked row
        { type: 'testdino:notify-slack', description: '#e2e-alerts' }, // → plain text
        { type: 'testdino:notify-slack', description: '@ashish' }, // → second slack target
      ],
    },
    async ({ page }) => {
      await page.goto('/');
      // Sanity: the annotations we declared are attached to this test.
      const types = test.info().annotations.map((a) => a.type);
      expect(types).toContain('testdino:priority');
      expect(types).toContain('testdino:link');
    }
  );

  // ───────────────────────────────────────────────────────────
  // 2. RUNTIME METRICS — renders "<name>: <value> <unit> / <threshold>"
  // ───────────────────────────────────────────────────────────
  test('Runtime metric annotations cover every metric shape', { tag: '@chromium' }, async ({ page }) => {
    await page.goto('/');

    const metrics = [
      // 2a. Full metric, threshold 0  → "flow-dom-steps-dev-fashion-en: 20 count / 0"
      { name: 'flow-dom-steps-dev-fashion-en', value: 20, unit: 'count', threshold: 0 },
      // 2b. Zero value, ms unit  → "flow-ai-inference-ms: 0 ms / 0"
      { name: 'flow-ai-inference-ms', value: 0, unit: 'ms', threshold: 0 },
      // 2c. Token count  → "flow-ai-inference-tokens: 0 count / 0"
      { name: 'flow-ai-inference-tokens', value: 0, unit: 'count', threshold: 0 },
      // 2d. Non-zero threshold  → "page-load-time: 1234 ms / 2000"
      { name: 'page-load-time', value: 1234, unit: 'ms', threshold: 2000 },
      // 2e. Decimal value, no threshold  → "lighthouse-perf: 9.5 score"
      { name: 'lighthouse-perf', value: 9.5, unit: 'score' },
      // 2f. No unit, no threshold  → "retries: 3"
      { name: 'retries', value: 3 },
      // 2g. Percentage unit  → "coverage: 87 % / 80"
      { name: 'coverage', value: 87, unit: '%', threshold: 80 },
      // 2h. MB unit  → "heap-used: 128 mb / 512"
      { name: 'heap-used', value: 128, unit: 'mb', threshold: 512 },
    ];

    for (const m of metrics) {
      test.info().annotations.push({ type: 'testdino:metric', description: JSON.stringify(m) });
    }

    // Each metric description must round-trip to the exact panel label.
    const pushed = test.info().annotations.filter((a) => a.type === 'testdino:metric');
    expect(pushed).toHaveLength(metrics.length);
    for (let i = 0; i < metrics.length; i++) {
      const parsed = JSON.parse(String(pushed[i].description));
      // @ts-ignore
      expect(formatMetric(parsed)).toBe(formatMetric(metrics[i]));
    }
  });

  // ───────────────────────────────────────────────────────────
  // 3. MALFORMED metrics — must fall back to the RAW description
  //    string (not blank, not a crash).
  // ───────────────────────────────────────────────────────────
  test('Malformed metric annotations fall back to raw text', { tag: '@chromium' }, async ({ page }) => {
    await page.goto('/');

    const malformed = [
      'this is not json', // 3a. not valid JSON  → raw string shown
      JSON.stringify({ value: 5, unit: 'ms' }), // 3b. missing "name"  → raw JSON shown
      JSON.stringify({ name: 'no-value', unit: 'ms' }), // 3c. missing "value"  → raw JSON shown
    ];

    for (const description of malformed) {
      test.info().annotations.push({ type: 'testdino:metric', description });
    }

    const pushed = test
      .info()
      .annotations.filter((a) => a.type === 'testdino:metric')
      .map((a) => a.description);
    expect(pushed).toEqual(malformed); // descriptions preserved verbatim for raw fallback
  });

  // ───────────────────────────────────────────────────────────
  // 4. LINK detection — a non-link type whose description is a URL
  //    is still rendered as a clickable link.
  // ───────────────────────────────────────────────────────────
  test('URL descriptions render as links regardless of type', { tag: '@chromium' }, async ({ page }) => {
    await page.goto('/');

    const url = 'https://www.browserbase.com/sessions/7ea40a10-e3ab-4e03-9aa7-8afc798c42a5';
    test.info().annotations.push({ type: 'testdino:context', description: url });

    const ctx = test.info().annotations.find((a) => a.type === 'testdino:context');
    expect(ctx?.description).toMatch(/^https?:\/\//);
  });

  // ───────────────────────────────────────────────────────────
  // 5. PLAIN (unprefixed) and native Playwright annotation types.
  //    Prefix stripping means "testdino:priority" and "priority"
  //    both normalize to "priority".
  // ───────────────────────────────────────────────────────────
  test(
    'Unprefixed and native Playwright annotation types',
    {
      tag: '@chromium',
      annotation: [
        { type: 'priority', description: 'p1' }, // no testdino: prefix
        { type: 'issue', description: 'https://github.com/org/repo/issues/42' },
        { type: 'unknown-custom-type', description: 'renders with default tag icon' },
      ],
    },
    async ({ page }) => {
      await page.goto('/');
      const types = test.info().annotations.map((a) => a.type);
      expect(types).toContain('priority');
      expect(types).toContain('unknown-custom-type');
    }
  );

  // ───────────────────────────────────────────────────────────
  // 6. NATIVE / LEGACY Playwright types that the renderer gives a
  //    dedicated icon+color to.
  //    IMPORTANT: `skip` / `fixme` / `fail` are Playwright's OWN reserved
  //    annotation types — DECLARING them changes test execution (skips the
  //    run / marks expected-fail) and also drives expected-status on the
  //    server (report.service.js). To exercise their RENDERING without
  //    skipping this test, we push them at runtime instead of declaring them.
  // ───────────────────────────────────────────────────────────
  test('Native Playwright annotation types with dedicated icons', { tag: '@chromium' }, async ({ page }) => {
    await page.goto('/');

    const native = [
      { type: 'note', description: 'Seeded via fixture, not the UI.' },
      { type: 'skip', description: 'Blocked on API-1234' }, // → expected status skipped
      { type: 'skipped', description: 'Disabled in this env' },
      { type: 'fixme', description: 'Selector drift after redesign' }, // → expected status skipped
      { type: 'fail', description: 'Known regression, tracked in BUG-99' }, // → expected status failed
      { type: 'slow', description: 'Large dataset render' },
      { type: 'pending', description: 'Awaiting backend endpoint' },
      { type: 'disabled', description: 'Feature-flagged off' },
      { type: 'only', description: 'Focused during local debugging' },
    ];

    for (const a of native) {
      test.info().annotations.push(a);
    }

    const types = test.info().annotations.map((a) => a.type);
    for (const { type } of native) {
      expect(types).toContain(type);
    }
  });

  // ───────────────────────────────────────────────────────────
  // 7. EDGE cases — full priority range + empty/absent description.
  // ───────────────────────────────────────────────────────────
  test(
    'Priority range and empty-description annotations',
    {
      tag: '@chromium',
      annotation: [
        { type: 'testdino:priority', description: 'p2' },
        { type: 'testdino:priority', description: 'p4' },
        { type: 'testdino:feature' }, // no description → row shows label only, no value
      ],
    },
    async ({ page }) => {
      await page.goto('/');
      const priorities = test
        .info()
        .annotations.filter((a) => a.type === 'testdino:priority')
        .map((a) => a.description);
      expect(priorities).toEqual(['p2', 'p4']);
      const feature = test.info().annotations.find((a) => a.type === 'testdino:feature');
      expect(feature?.description).toBeUndefined();
    }
  );
});
