import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const script = readFileSync(
  new URL('../scripts/create-consultation-form.gs', import.meta.url),
  'utf8',
);

// This mock verifies the script's service contract and retry behavior. It does
// not exercise Google's servers, account permissions, or actual form submission.
function createGoogleMock({ advanced = true, failPublishing = false } = {}) {
  const state = {
    created: 0,
    opened: [],
    items: [],
    calls: [],
    properties: new Map(),
    logs: [],
    released: 0,
  };
  let publishFailure = failPublishing;

  function item(type) {
    const record = { type };
    state.items.push(record);
    const builder = {
      setTitle(value) {
        record.title = value;
        return builder;
      },
      setRequired(value) {
        record.required = value;
        return builder;
      },
      setHelpText(value) {
        record.helpText = value;
        return builder;
      },
    };
    if (type === 'text')
      builder.setValidation = (value) => {
        record.validation = value;
        return builder;
      };
    if (type === 'date')
      builder.setIncludesYear = (value) => {
        record.includesYear = value;
        return builder;
      };
    return builder;
  }

  const form = {
    getId: () => 'owned-form-id',
    getPublishedUrl: () => 'https://docs.google.com/forms/d/e/respondent-id/viewform',
    addTextItem: () => item('text'),
    addDateItem: () => item('date'),
    addParagraphTextItem: () => item('paragraph'),
    setDescription(value) {
      state.description = value;
      return form;
    },
    setConfirmationMessage(value) {
      state.confirmation = value;
      return form;
    },
    setCollectEmail(value) {
      state.collectEmail = value;
      return form;
    },
    setLimitOneResponsePerUser(value) {
      state.oneResponse = value;
      return form;
    },
    setPublishingSummary(value) {
      state.publicSummary = value;
      return form;
    },
    setShowLinkToRespondAgain(value) {
      state.respondAgain = value;
      return form;
    },
    supportsAdvancedResponderPermissions: () => advanced,
    setPublished(value) {
      state.calls.push(['publish', value]);
      if (publishFailure) {
        publishFailure = false;
        throw new Error('Account policy blocked publishing');
      }
      state.published = value;
      return form;
    },
    setAcceptingResponses(value) {
      state.calls.push(['accept', value]);
      state.accepting = value;
      return form;
    },
  };

  const context = vm.createContext({
    LockService: {
      getScriptLock: () => ({
        waitLock: (timeout) => assert.equal(timeout, 30000),
        releaseLock: () => {
          state.released++;
        },
      }),
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (key) => state.properties.get(key) ?? null,
        setProperty: (key, value) => state.properties.set(key, value),
      }),
    },
    FormApp: {
      create(title) {
        state.created++;
        state.title = title;
        return form;
      },
      openById(id) {
        state.opened.push(id);
        if (id !== 'owned-form-id') throw new Error('Form not found');
        return form;
      },
      createTextValidation() {
        const validation = {};
        const builder = {
          requireTextIsEmail() {
            validation.email = true;
            return builder;
          },
          setHelpText(value) {
            validation.helpText = value;
            return builder;
          },
          build: () => validation,
        };
        return builder;
      },
    },
    Logger: { log: (message) => state.logs.push(message) },
  });
  vm.runInContext(script, context, { filename: 'create-consultation-form.gs' });
  return { state, run: () => context.createConsultationForm() };
}

test('Apps Script creates the seven required questions and returns usable respondent links', () => {
  const { state, run } = createGoogleMock();
  const links = run();
  assert.equal(state.created, 1);
  assert.deepEqual(
    state.items.map(({ title }) => title),
    [
      'Name',
      'Email',
      'Phone number',
      'Wedding or event date',
      'What have you done so far?',
      'What support are you expecting from me?',
      'What is your budget?',
    ],
  );
  assert.ok(state.items.every((question) => question.required === true));
  assert.equal(state.items[1].validation.email, true);
  assert.equal(state.items[3].type, 'date');
  assert.equal(state.items[3].includesYear, true);
  assert.equal(state.items[4].type, 'paragraph');
  assert.equal(state.items[5].type, 'paragraph');
  assert.equal(
    state.publicSummary,
    false,
    'Consultation answers must not be published as a summary',
  );
  assert.equal(
    state.oneResponse,
    false,
    'Respondents should not need sign-in just for response limits',
  );
  assert.equal(state.collectEmail, false, 'The explicit validated email question is used');
  assert.deepEqual(state.calls, [
    ['publish', true],
    ['accept', true],
  ]);
  assert.equal(new URL(links.publicUrl).pathname, '/forms/d/e/respondent-id/viewform');
  assert.equal(new URL(links.embedUrl).searchParams.get('embedded'), 'true');
  assert.ok(
    state.logs.some((line) => line === `Website setting: VITE_GOOGLE_FORM_URL=${links.publicUrl}`),
  );
  assert.equal(state.released, 1);
});

test('rerunning reuses the form without duplicating questions or overwriting owner edits', () => {
  const { state, run } = createGoogleMock();
  const firstLinks = run();
  state.items[4].title = 'Tell me about the plans you already made';
  const secondLinks = run();
  assert.equal(state.created, 1);
  assert.deepEqual(state.opened, ['owned-form-id']);
  assert.equal(state.items.length, 7);
  assert.equal(state.items[4].title, 'Tell me about the plans you already made');
  assert.equal(secondLinks.publicUrl, firstLinks.publicUrl);
  assert.equal(state.released, 2);
});

test('legacy forms accept responses without unsupported publishing operations', () => {
  const { state, run } = createGoogleMock({ advanced: false });
  run();
  assert.deepEqual(state.calls, [['accept', true]]);
  assert.equal(state.accepting, true);
});

test('publishing failures preserve the created form so a corrected retry does not duplicate it', () => {
  const { state, run } = createGoogleMock({ failPublishing: true });
  assert.throws(run, /Account policy blocked publishing/);
  assert.equal(state.properties.get('LYDSEVENTS_CONSULTATION_FORM_ID'), 'owned-form-id');
  assert.equal(state.released, 1);
  run();
  assert.equal(state.created, 1);
  assert.equal(state.items.length, 7);
  assert.equal(state.published, true);
  assert.equal(state.accepting, true);
  assert.equal(state.released, 2);
});

test('an inaccessible saved form reports the problem instead of creating a replacement', () => {
  const { state, run } = createGoogleMock();
  state.properties.set('LYDSEVENTS_CONSULTATION_FORM_ID', 'missing-form');
  assert.throws(run, /saved LydsEvents form could not be opened/);
  assert.equal(state.created, 0);
  assert.equal(state.items.length, 0);
  assert.equal(state.released, 1);
});
