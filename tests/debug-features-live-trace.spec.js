// @ts-check
// Test 2 of 2 — exercises the rest of Playwright 1.59's debugging surface:
// live tracing, ariaSnapshot, console-message filtering, and the
// async-dispose pattern. Fails intentionally.
import { expect, test } from '@playwright/test';

// Disable the config's auto-tracing for this file so we can own
// tracing.start()/stop() ourselves and exercise the new `live: true` option.
// test.use({ trace }) must be at file scope — nesting it in a describe fails.
test.use({ trace: 'off' });

test.describe('Playwright 1.59 — live trace, aria snapshot, console filter', () => {

  test('aria snapshot + live trace + console filter (fails intentionally)', async ({ browser }, testInfo) => {
    const tracePath = testInfo.outputPath('live-run.zip');
    const videoDir = testInfo.outputPath('video');

    // Spin up our own context so we fully own its tracing and video
    // lifecycle. recordVideo on a manually-created context is the only way
    // to get a video artifact here (the auto-video fixture only applies to
    // the default `page` fixture).
    const context = await browser.newContext({ recordVideo: { dir: videoDir } });
    const page = await context.newPage();

    // ---- live tracing (1.59) ---------------------------------------------
    // With `live: true`, trace chunks are flushed to disk continuously. You
    // can open them in real time from another terminal:
    //     npx playwright show-trace --live <path-to-trace.zip>
    // Useful when a long-running test hangs — you can see what it's doing
    // right now without waiting for stop().
    await context.tracing.start({
      name: 'live-run',
      title: 'aria snapshot run',
      screenshots: true,
      snapshots: true,
      sources: true,
      live: true,
    });

    // ---- async-dispose pattern (1.59) ------------------------------------
    // In a TS project you'd write:
    //     await using cdp = await context.newCDPSession(page);
    // and Symbol.asyncDispose would call cdp.detach() at block exit. This
    // plain-JS file's parser doesn't accept the syntax, so we do the same
    // cleanup manually via try/finally — the underlying disposal hook is
    // identical.
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');

    try {
      await page.goto('/');

      // ---- ariaSnapshot (1.59) -------------------------------------------
      // Serialize the accessibility tree as a YAML-ish string. Easy to diff
      // across runs and cheap to feed to an LLM for a semantic diff. In 1.59,
      // `mode` accepts 'default' (human-readable) or 'ai' (token-efficient
      // for LLMs).
      const snapshot = await page.locator('body').ariaSnapshot({ mode: 'ai' });
      console.log('--- ARIA SNAPSHOT (first 400 chars) ---');
      console.log(snapshot.slice(0, 400));

      // Emit console output from the page so we have something to filter on.
      await page.evaluate(() => {
        console.log('hello from the page');
        console.warn('a benign warning');
        console.error('INTENDED_ERROR: nothing actually broke');
      });

      // ---- buffered console messages (1.59) ------------------------------
      // 1.59 buffers console messages on the page, so you can pull them
      // retroactively — no up-front page.on('console') listener needed. The
      // `filter` option is a string: 'all' (everything since the page
      // opened) or 'since-navigation' (only since the last top-level nav).
      // Then you narrow by type() in JS. Companion APIs:
      // page.clearConsoleMessages(), page.pageErrors(),
      // page.clearPageErrors(), consoleMessage.timestamp().
      const allMessages = await page.consoleMessages({ filter: 'since-navigation' });
      const errors = allMessages.filter(m => m.type() === 'error');

      // Intentional failure — we asked for zero errors, we have one.
      // The saved trace can then be inspected from the CLI with the new
      // agent-friendly commands (1.59):
      //     npx playwright trace actions <trace.zip> --grep "expect"
      //     npx playwright trace action <n> <trace.zip>
      //     npx playwright trace snapshot <n> --name after <trace.zip>
      expect(errors, `got ${errors.length} console error(s)`).toHaveLength(0);
    } finally {
      // Stop + attach in finally so the trace survives intentional failures.
      // attach() surfaces the artifacts in the HTML reporter under this test.
      await context.tracing.stop({ path: tracePath });
      await cdp.detach();
      const videoFile = await page.video()?.path();
      await context.close();

      await testInfo.attach('live-run.zip', { path: tracePath, contentType: 'application/zip' });
      if (videoFile) {
        await testInfo.attach('video.webm', { path: videoFile, contentType: 'video/webm' });
      }
    }
  });

});
