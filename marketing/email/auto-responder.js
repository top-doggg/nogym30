function onFormSubmit(e) {
  try {
    const responses = e.namedValues;
    const email = (responses['Email'] && responses['Email'][0]) ? responses['Email'][0].trim() : '';
    if (!email || !email.includes('@')) return;

    const subject = 'No-Gym 30 — Your Free 3-Day Sample (inside)';

    const body = [
      'Quick question before Day 1:',
      '',
      'Why do most plans fail by Day 3?',
      '',
      'Not motivation. Structure. The standard model assumes 60-minute blocks, a gym, and perfect consistency. Real life doesn’t.',
      '',
      'No-Gym 30 is different because the first workout takes 10 minutes, uses no equipment, and has a reset plan built in for missed days.',
      '',
      'If you’re testing the free sample, watch for two things:',
      '1) Can you finish Day 1 in your actual schedule?',
      '2) What makes you quit other plans, but not this one?',
      '',
      'Full plan here: https://nogym30.netlify.app/',
      '',
      '— The No-Gym 30 Team'
    ].join('\n');

    const aliases = GmailApp.getAliases();
    const sender = (aliases && aliases.length) ? aliases[0] : Session.getActiveUser().getEmail();

    GmailApp.sendEmail(email, subject, body, {
      name: 'No-Gym 30',
      from: sender,
      replyTo: sender
    });

  } catch (err) {
    console.error('Auto-responder failed', err);
  }
}

function setupTrigger() {
  const ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
}
