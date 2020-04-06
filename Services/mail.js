"use strict";
require("dotenv").config();

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = 'OnBoarding@vodafone.com';

/////////////////////////////////////////////////////////////

const sendEmail = (
    toMailList,
    subject,
    htmlbody,
    callBack,
    errCallBack = () => { }
) => {
    // TODO: make the mail template ready

    let msg = {
        from: fromEmail,
        to: toMailList,
        subject: subject,
        html: htmlbody
    };

    console.log("Message:", msg);

    sgMail.send(msg, function (err) {
        if (err) {
            errCallBack(err);
            throw err;
        }
        else {
            callBack();
            console.log("Email Sent");
        }
    });
};

module.exports = { sendEmail };