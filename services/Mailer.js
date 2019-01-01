const sgMail = require('@sendgrid/mail');

class Mailer { 
    constructor(subject, recipients, content) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        this.from_email = 'no-reply@getkarati.com';
        this.subject = subject;
        this.recipients = this.formatAddresses(recipients);

        this.composeMail = {
            to: this.recipients,
            from: this.from_email,
            subject: this.subject,
            text: this.subject,
            html: content
        }
    }

    formatAddresses(recipients) {
        return recipients.map( ( {email} ) => {
            console.log('email: ' + email);
            return email;
        });
    }

    send() {
        try {
            sgMail.sendMultiple(this.composeMail);
        } catch (err) {
            console.log('ERROR IN MAILER: ' + err);
        }
    }
}

module.exports = Mailer;

// const sendGrid = require('sendgrid');
// const helper = sendGrid.mail;

// sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

// class Mailer extends helper.Mail {
//     constructor( subject, recipients, content ) {
//         super();

//         this.sgApi = sendGrid(process.env.SENDGRID_API_KEY);

//         this.from_email = new helper.Email('no-reply@getkarati.com');
//         this.subject = subject;
//         this.body = new helper.Content('text/html', content);

//         this.recipients = this.formatAddresses(recipients);

//         this.addContent(this.body);
//         this.addClickTracking();
//         this.addRecipients();
//     }

//     formatAddresses(recipients) {
//         return recipients.map( ({email}) => {
//             console.log('email: ' + email);
//             return new helper.Email(email);
//         });
//     };

//     addClickTracking() {
//         const trackingSettings = new helper.TrackingSettings();
//         const clickTracking = new helper.ClickTracking(true, true);

//         trackingSettings.setClickTracking(clickTracking);
//         this.addTrackingSettings(trackingSettings);
//     }

//     addRecipients() {
//         const personalize = new helper.Personalization();

//         this.recipients.forEach(recipient => {
//             personalize.addTo(recipient);
//         });

//         this.addPersonalization(personalize);
//     }

//     send() {
//         const request = this.sgApi.emptyRequest({
//             method: 'POST',
//             path: 'v3/mail/send',
//             body: this.toJSON()
//         });

//         const response = this.sgApi.API(request);
//         console.log(response);
//     };
// }

// module.exports = Mailer;