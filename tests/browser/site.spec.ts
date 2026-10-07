import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('loads the site and all photographs without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto('/');
  await expect(page).toHaveTitle(/LydsEvents/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your moment.');
  await page.locator('#portfolio').scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator('img')
        .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)),
    )
    .toBe(true);
  await expect(page.getByRole('button', { name: 'Explore Lydia’s portfolio' })).toBeVisible();
  await expect(page.getByTitle('Lydia’s wedding and event portfolio presentation')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('gallery responds to arrows, keyboard, dots and playback controls', async ({ page }) => {
  await page.goto('/');
  const gallery = page.getByRole('region', { name: 'LydsEvents portfolio' });
  await gallery.scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Pause photo slideshow' }).click();
  await expect(page.getByRole('button', { name: 'Play photo slideshow' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Next photo' }).click();
  await expect(page.getByRole('button', { name: 'Show photo 2' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'Show photo 3' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Show photo 8' }).click();
  await page.getByRole('button', { name: 'Next photo' }).click();
  await expect(page.getByRole('button', { name: 'Show photo 1' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Previous photo' }).click();
  await expect(page.getByRole('button', { name: 'Show photo 8' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Show photo 2' }).click();
  await expect(gallery.getByRole('status')).toContainText('Image 2 of 8');
});

test('reduced motion disables autoplay and transition effects', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Pause photo slideshow' })).toHaveCount(0);
  await page.clock.fastForward(15000);
  await expect(page.getByRole('button', { name: 'Show photo 1' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(
    await page
      .locator('.gallery-slide')
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe('0s');
});

test('tier selection reaches consultation and saves all seven answers locally', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('link', { name: 'This sounds like me — One month out' }).click();
  await expect(page).toHaveURL(/#consultation$/);
  await expect(page.locator('.selected-tier')).toContainText('One month out');
  await page.getByLabel('Your name').fill('Sample Couple');
  await page.getByLabel('Email address').fill('couple@example.com');
  await page.getByLabel('Phone number').fill('+1 555 010 0123');
  await page.getByLabel('Wedding or event date').fill('2027-06-18');
  await page.getByLabel('What have you done so far?').fill('Venue and florist booked.');
  await page
    .getByLabel('What support are you hoping for?')
    .fill('Vendor coordination and a relaxed morning.');
  await page.getByLabel('What’s your budget?').fill('$20,000 event budget');
  const requestMethods: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') requestMethods.push(request.url());
  });
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save my consultation notes' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  const notes = await readFile(path!, 'utf8');
  for (const value of [
    'Sample Couple',
    'couple@example.com',
    '+1 555 010 0123',
    '2027-06-18',
    'Venue and florist booked.',
    'Vendor coordination and a relaxed morning.',
    '$20,000 event budget',
    'One month out',
  ])
    expect(notes).toContain(value);
  await expect(
    page.getByRole('status').filter({ hasText: 'no request has been sent' }),
  ).toBeVisible();
  expect(requestMethods).toEqual([]);
});

test('required fields and email validation prevent invalid consultation notes', async ({
  page,
}) => {
  await page.goto('/#consultation');
  await page.getByRole('button', { name: 'Save my consultation notes' }).click();
  expect(await page.locator('form').evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(
    false,
  );
  await expect(page.locator('.form-success')).toHaveCount(0);
  await page.getByLabel('Email address').fill('invalid-email');
  expect(
    await page
      .getByLabel('Email address')
      .evaluate((input: HTMLInputElement) => input.validity.typeMismatch),
  ).toBe(true);
});

test('FAQs expose and hide their answer', async ({ page }) => {
  await page.goto('/');
  const question = page.getByRole('button', { name: 'How does the $500 weekly rate work?' });
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByRole('region', { name: 'How does the $500 weekly rate work?' }),
  ).toContainText('number of weeks');
  await question.click();
  await expect(
    page.getByRole('region', { name: 'How does the $500 weekly rate work?' }),
  ).toHaveCount(0);
});

test('mobile navigation works and the layout stays inside small viewports', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Portfolio' }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Ways to work together' }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  for (const width of [320, 375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `No horizontal overflow at ${width}px`,
    ).toBe(true);
  }
});

test('a configured form is embedded with a usable external fallback', async ({ page }) => {
  // A local fixture verifies integration only; it never submits to Google.
  await page.route('https://docs.google.com/forms/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<html><body><h1>Google Form test fixture</h1></body></html>',
    }),
  );
  await page.goto('http://127.0.0.1:5174/#consultation');
  const frame = page.getByTitle('LydsEvents consultation request form');
  await expect(frame).toHaveAttribute(
    'src',
    'https://docs.google.com/forms/d/e/TEST_FORM_ID/viewform?embedded=true',
  );
  await expect(
    page.getByRole('link', { name: 'Open the consultation form in a new tab' }),
  ).toHaveAttribute('href', 'https://docs.google.com/forms/d/e/TEST_FORM_ID/viewform');
  await expect(page.getByRole('button', { name: 'Save my consultation notes' })).toHaveCount(0);
  await expect(
    page.frameLocator('iframe').getByRole('heading', { name: 'Google Form test fixture' }),
  ).toBeVisible();
});

test('the presentation opens on demand and the dialog restores focus on Escape', async ({
  page,
}) => {
  // Network policy blocks the real deck in this environment; verify the embed
  // wiring and dialog behavior with a local response, not the deck contents.
  await page.route('https://docs.google.com/presentation/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<html><body><h1>Portfolio presentation fixture</h1></body></html>',
    }),
  );
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Explore Lydia’s portfolio' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'LydsEvents portfolio presentation' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link')).toHaveAttribute(
    'href',
    /1iFFBQPyygs-H0GvaRIWCflWeG6z2dox5zJ8zE1vx5Ps/,
  );
  await expect(
    page
      .frameLocator('.portfolio-dialog-frame')
      .getByRole('heading', { name: 'Portfolio presentation fixture' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close portfolio presentation' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByTitle('Lydia’s wedding and event portfolio presentation')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});
