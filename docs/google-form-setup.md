# Connect the consultation form

The website embeds a Google Form when `VITE_GOOGLE_FORM_URL` is configured. The
form must be created in the Google account that should own and receive the
consultation responses. A live form has not been created by this repository.

1. Sign in to the intended Google account and open
   [Google Apps Script](https://script.google.com/home/start). Create a new project.
2. Copy [create-consultation-form.gs](../scripts/create-consultation-form.gs) into
   the project's `Code.gs`, save, select `createConsultationForm`, and click **Run**.
   Review and authorize the Google Forms permissions for your own script.
3. Copy the **Public form** URL from the execution log. Open the form in Google
   Forms and check its publishing/respondent settings. Allow **anyone with the
   link** to respond if your account supports that option. Workspace administrator
   restrictions may require an administrator's help or another account.
4. Test the public URL in a signed-out or private browser window. Submit a test
   consultation request and confirm it appears under the form's **Responses** tab.
   You can enable email notifications there and optionally link a Google Sheet.
5. Create `.env.local` in the website root and add the public respondent URL:

   ```dotenv
   VITE_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform
   ```

   Use the URL ending in `viewform`, not the form editor URL or the whole iframe
   markup. The site adds the embed option. This is a public URL, not a secret;
   never add Google credentials to a `VITE_` variable.

6. Restart the development server. For a deployed website, add the same variable
   to your host's build environment and rebuild/redeploy. Vite reads this value
   at build time.

The script creates all seven required fields: name, validated email, phone
number, wedding or event date, planning completed so far, expected support, and
budget. Budget is free text so visitors can give an amount, range, or estimate
with its currency. Responses stay in the form owner's Google account.

Running the function again reuses the form saved in the Apps Script project's
Script Properties, preserves its questions and responses, and enables it to
accept responses. If you intentionally delete the form, delete the
`LYDSEVENTS_CONSULTATION_FORM_ID` property in **Project Settings → Script
Properties** before running again. Keep the script project for future access.

Google reference documentation:
[FormApp](https://developers.google.com/apps-script/reference/forms/form-app),
[Form](https://developers.google.com/apps-script/reference/forms/form), and
[TextValidationBuilder](https://developers.google.com/apps-script/reference/forms/text-validation-builder).
