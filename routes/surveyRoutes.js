const _ = require('lodash');
const { Path } = require('path-parser');
// this is a default NodeJS module
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

/**
 * we certainly could require Survey.js directly here, but some testing frameworks, when working
 * with Mongoose will complain when we require a model file multiple times in our code
 *
 * Remember that we already require Survey.js one time inside our index.js, which add the surveys model inside mongoose
 * Therefore here we can just grab that model from mongoose
 */

const Survey = mongoose.model('surveys');

module.exports = (app) => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    // do not include the recipients attributes when retrieving the survey list
    const surveys = await Survey.find({
      _user: req.user.id,
    }).select({ recipients: false });

    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');
    console.log(req.body);
    _.chain(req.body)
      .filter(({ event }) => event === 'click')
      .map(({ email, url }) => {
        // p.test() will try to extract surveyId and choice from pathname
        // if the pathname doesn't conform to the pattern in Path(), p.test() returns null
        // cannot destructure it to { surveyId, choice } here because match can be null
        console.log(email);
        console.log(url);
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, ...match };
        }
      })
      .compact() // remove undefined elements from result of map()
      .uniqBy('email', 'surveyId') // remove duplicate elements based on combination of 'email' and 'surveyId'
      .each(({ surveyId, choice, email }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: {
                email: email,
                responded: false,
              },
            },
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date(),
          }
        ).exec();
      })
      .value();
    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      // ES6 syntax when key and value variable has the same name
      title,
      body,
      subject,
      recipients: recipients.split(',').map((email) => ({
        // we trim the email because the list might be comma and space seperated, so after splitting by comma
        // there might be some leading and trailing whitespaces that need to be removed
        email: email.trim(),
      })),
      // this id is the auto-generated one by Mongoose
      _user: req.user.id,
      // we haven't sent the survey yet, but it's close enough
      dateSent: Date.now(),
    });

    // Great place to send an email!
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
