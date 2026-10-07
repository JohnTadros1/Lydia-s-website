import assert from 'node:assert/strict';
import test from 'node:test';
import { consultationNotes, googleFormLinks } from '../src/form-utils.mjs';

test('Google Form links accept respondent URLs and normalize the embed option', () => {
  for (const path of ['/forms/d/e/public-form_123/viewform', '/forms/d/form-123/viewform/']) {
    const input = ` https://docs.google.com${path}?usp=sharing&entry.123=Garden%20wedding&embedded=false `;
    const links = googleFormLinks(input);
    assert.ok(links);
    const publicUrl = new URL(links.publicUrl);
    const embedUrl = new URL(links.embedUrl);
    assert.equal(publicUrl.pathname, path);
    assert.equal(publicUrl.searchParams.has('embedded'), false);
    assert.equal(embedUrl.searchParams.get('embedded'), 'true');
    assert.equal(embedUrl.searchParams.getAll('embedded').length, 1);
    for (const url of [publicUrl, embedUrl]) {
      assert.equal(url.origin, 'https://docs.google.com');
      assert.equal(url.searchParams.get('usp'), 'sharing');
      assert.equal(url.searchParams.get('entry.123'), 'Garden wedding');
    }
  }
});

test('Google Form links reject nonrespondent links, lookalike hosts, credentials, and unsupported protocols', () => {
  const invalid = [
    undefined,
    null,
    false,
    42,
    {},
    '',
    'not a URL',
    'javascript:alert(1)',
    'http://docs.google.com/forms/d/e/test/viewform',
    '//docs.google.com/forms/d/e/test/viewform',
    'https://forms.gle/short-link',
    'https://docs.google.com.evil.example/forms/d/e/test/viewform',
    'https://docs.google.com@evil.example/forms/d/e/test/viewform',
    'https://person:password@docs.google.com/forms/d/e/test/viewform',
    'https://docs.google.com:8443/forms/d/e/test/viewform',
    'https://docs.google.com/forms/d/e/test/edit',
    'https://docs.google.com/forms/d/e/test/formResponse',
    'https://docs.google.com/forms/d/e/test/viewform/extra',
    'https://docs.google.com/document/d/test/viewform',
    'https://docs.google.com/forms/d/e//viewform',
  ];
  for (const value of invalid) {
    assert.equal(googleFormLinks(value), null, `Should reject ${String(value)}`);
  }
});

test('consultation notes preserve all seven answers, Unicode, multiline plans, and the selected tier', () => {
  const entries = {
    name: '  Zoë & José  ',
    email: 'zoe@example.com',
    phone: '+44 (0) 20 1234 5678',
    date: '2027-06-19',
    progress: 'Venue booked\nFlorist deposit paid — peonies!',
    support: 'Vendor coordination\nKeep the surprise dance a secret.',
    budget: '€5,000–€7,000 for coordination',
  };
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.set(key, value);
  const notes = consultationNotes(data, 'One month out');
  assert.ok(notes.includes('They have not been sent to LydsEvents.'));
  assert.ok(notes.includes('Interested in: One month out'));
  for (const value of Object.values(entries)) assert.ok(notes.includes(value.trim()));
  assert.ok(
    notes.includes('What I have done so far: Venue booked\nFlorist deposit paid — peonies!'),
  );
  assert.ok(notes.includes('Name: Zoë & José\nEmail:'));
});

test('consultation notes tolerate omitted answers without inventing a tier or values', () => {
  const notes = consultationNotes(new FormData(), null);
  assert.equal(notes.includes('Interested in:'), false);
  assert.equal(notes.includes('undefined'), false);
  assert.equal(notes.includes('null'), false);
  for (const label of [
    'Name',
    'Email',
    'Phone number',
    'Wedding or event date',
    'What I have done so far',
    'The support I am looking for',
    'Budget',
  ]) {
    assert.ok(notes.includes(`${label}: `));
  }
});
