// @ts-check
// Test 1 of 2 — exercises Playwright 1.59's new page.screencast API.
// Fails intentionally so the reporter retains video + trace artifacts.
import { expect, test } from '@playwright/test';

test.describe('Playwright 1.59 — screencast API', () => {

  // ---------------------------------------------------------------------------
  // 1.59 introduces page.screencast as a unified capture interface. Unlike
  // the context-level `recordVideo` option (set-and-forget), screencast is
  // imperative: you call start/stop inside the test, can layer action
  // annotations, chapter titles, and custom HTML overlays onto the recording,
  // and the output ends up as a test attachment in the HTML reporter.
  //
  // Relation to videos:  screencast *replaces* recordVideo for any case where
  //   you want control over what's captured. The emitted .webm is exactly
  //   what the `video` attachment points to.
  //
  // Relation to traces:  every screencast.start / showChapter / showActions /
  //   showOverlay call is a first-class action in the trace timeline. Open
  //   the trace and you'll see each chapter switch lined up next to the
  //   DOM snapshot at that moment — you can scrub video and trace in lockstep.
  // ---------------------------------------------------------------------------
  test('screencast walkthrough of the store (fails intentionally)', async ({ page }, testInfo) => {
    const videoPath = testInfo.outputPath('walkthrough.webm');

    // start() begins encoding frames into a .webm.
    await page.screencast.start({ path: videoPath });

    // Overlay a badge every time Playwright performs an action (click, fill,
    // hover…). This is the "agentic video receipt" feature — reviewers see
    // why the cursor moved where it did. position + fontSize configurable.
    await page.screencast.showActions({ position: 'top-right', fontSize: 14 });

    // Chapters render a titled section for `duration` ms, giving the video a
    // narrative structure that a reviewer (or LLM) can navigate.
    await page.screencast.showChapter('Open storefront', {
      description: 'Navigate to the products landing page',
      duration: 1200,
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await page.screencast.showChapter('Inspect layout', {
      description: 'Check the logo and hero copy are present',
      duration: 1000,
    });

    // A few selector-agnostic interactions so the screencast has real frames
    // and showActions() has actions to annotate before we hit the failure.
    await page.locator('body').hover();
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(500);

    await page.screencast.showChapter('Scan products', {
      description: 'Scroll the grid end-to-end',
      duration: 1000,
    });

    await page.keyboard.press('End');
    await page.waitForTimeout(800);
    await page.keyboard.press('Home');
    await page.waitForTimeout(500);

    // Arbitrary HTML overlay — good for stamping build IDs, test names, etc.
    await page.screencast.showOverlay(
      `<div style="padding:6px 10px;background:#222;color:#0f0;font-family:monospace">
         test run — ${new Date().toISOString()}
       </div>`,
      { position: 'bottom-left', duration: 2000 }
    );

    await page.screencast.showChapter('Final title check', {
      description: 'Assert the page title (intentionally wrong)',
      duration: 800,
    });

    // Intentional failure — the real title is "TestDino | Demo Store". The
    // failure triggers retain-on-failure for both trace and video, so the
    // reporter ends up with the screencast.webm AND a trace.zip whose
    // timeline contains every screencast.* action above.
    await expect(page).toHaveTitle(/Unicorns/);

    await page.screencast.stop();
  });

});
