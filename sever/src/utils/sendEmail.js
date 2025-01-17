const { SendEmailCommand } = require("@aws-sdk/client-ses"); // Correct capitalization of SendEmailCommand
const { sesClient } = require("./sesClient"); // Import your SES client

/**
 * Create a SendEmailCommand
 * @param {string} toAddress - The recipient's email address
 * @param {string} fromAddress - The sender's email address
 * @param {string} subject - The subject of the email
 * @param {string} htmlBody - The HTML content of the email body
 * @param {string} textBody - The plain text content of the email body
 * @returns {SendEmailCommand} - The configured SendEmailCommand
 */
const createSendEmailCommand = (
  toAddress,
  fromAddress,
  subject,
  htmlBody,
  textBody
) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress], // Correct capitalization
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

/**
 * Sends an email using AWS SES
 * @param {string} toAddress - The recipient's email address
 * @param {string} fromAddress - The sender's email address
 * @param {string} subject - The subject of the email
 * @param {string} htmlBody - The HTML content of the email body
 * @param {string} textBody - The plain text content of the email body
 */

const run = async (subject, htmlBody, textBody) => {
  const SendEmailCommand = createSendEmailCommand(
    "tusharshitole6767@gmail.com",
    "tushar@devmatch.tusharshitole.site",
    subject,
    htmlBody,
    textBody
  );

  try {
    return await sesClient.send(SendEmailCommand);
  } catch (error) {
    console.log(error);
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
