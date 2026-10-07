/**
 * Run createConsultationForm in a standalone Google Apps Script project owned
 * by the account that should receive LydsEvents consultation requests.
 *
 * Re-running this function reuses the same form and preserves its questions
 * and responses. Public URLs are logged; no account credentials are logged.
 */
function createConsultationForm() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var properties = PropertiesService.getScriptProperties();
    var propertyName = 'LYDSEVENTS_CONSULTATION_FORM_ID';
    var existingId = properties.getProperty(propertyName);
    var form;

    if (existingId) {
      try {
        form = FormApp.openById(existingId);
      } catch (error) {
        throw new Error(
          'The saved LydsEvents form could not be opened. Check that this ' +
            'Google account still has access. If you intentionally deleted the ' +
            "form, remove LYDSEVENTS_CONSULTATION_FORM_ID from this project's " +
            'Script Properties before running again.',
        );
      }
    } else {
      form = FormApp.create('LydsEvents | Request a consultation');
      form.setDescription(
        'Tell me a little about your wedding or event, where you are in the ' +
          'planning process, and how I can help. Your contact details will be ' +
          'used to follow up about your consultation request.',
      );
      form.setConfirmationMessage(
        'Thank you for reaching out to LydsEvents! Your consultation request ' +
          'has been received.',
      );
      form.setCollectEmail(false);
      form.setLimitOneResponsePerUser(false);
      form.setPublishingSummary(false);
      form.setShowLinkToRespondAgain(false);

      form.addTextItem().setTitle('Name').setRequired(true);

      var emailValidation = FormApp.createTextValidation()
        .requireTextIsEmail()
        .setHelpText('Please enter a valid email address.')
        .build();
      form.addTextItem().setTitle('Email').setValidation(emailValidation).setRequired(true);

      form
        .addTextItem()
        .setTitle('Phone number')
        .setHelpText('Please include your country code.')
        .setRequired(true);

      form.addDateItem().setTitle('Wedding or event date').setIncludesYear(true).setRequired(true);

      form
        .addParagraphTextItem()
        .setTitle('What have you done so far?')
        .setHelpText('For example: a venue, vendors, a guest list, or a timeline.')
        .setRequired(true);

      form
        .addParagraphTextItem()
        .setTitle('What support are you expecting from me?')
        .setHelpText('Share the planning or coordination support you would like.')
        .setRequired(true);

      form
        .addTextItem()
        .setTitle('What is your budget?')
        .setHelpText(
          'Please include your currency and whether this is your overall ' +
            'event budget or your budget for planning support. An estimate is welcome.',
        )
        .setRequired(true);

      // Save before publishing so a publishing-policy error does not cause
      // another form to be created when this function is run again.
      properties.setProperty(propertyName, form.getId());
    }

    // Newer Google Forms support explicit publishing. Older forms already
    // expose a respondent URL and use accepting-responses status instead.
    if (
      typeof form.supportsAdvancedResponderPermissions === 'function' &&
      form.supportsAdvancedResponderPermissions()
    ) {
      form.setPublished(true);
    }
    form.setAcceptingResponses(true);

    var publicUrl = form.getPublishedUrl();
    var separator = publicUrl.indexOf('?') === -1 ? '?' : '&';
    var links = {
      publicUrl: publicUrl,
      embedUrl: publicUrl + separator + 'embedded=true',
    };

    Logger.log('Public form: ' + links.publicUrl);
    Logger.log('Embed URL: ' + links.embedUrl);
    Logger.log('Website setting: VITE_GOOGLE_FORM_URL=' + links.publicUrl);
    return links;
  } finally {
    lock.releaseLock();
  }
}
