'use strict'

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */
// Public node modules.
const _ = require('lodash')
const nodemailer = require('nodemailer')
const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');

module.exports = {
  provider: 'nodemailer',
  name: 'Nodemailer',

  init: (providerOptions = {}, settings = {}) => {
    // if (providerOptions.auth && providerOptions.auth.method === 'NTLM'){
      // providerOptions.customAuth = {
        // NTLM: nodemailerNTLMAuth
      // }
    // }
    const transporter = nodemailer.createTransport(providerOptions);

    return {
      send: (options) => {
        console.log('FROM ADDRESS: ', options.from)
        return new Promise((resolve, reject) => {
          // Default values.
          options = _.isObject(options) ? options : {}
          options.from = options.from || settings.defaultFrom
          if (!options.from.includes('"')) { // fix formatting
            const fromSplit = options.from.split('<');
            const p1 = '"' + fromSplit[0].trim() + '"';
            const p2 = '<' + fromSplit[1];

            options.from = p1 + ' ' + p2;
          }
          console.log('NEW FROM ADDRESS: ', options.from)
          options.replyTo = options.replyTo || settings.defaultReplyTo
          options.text = options.text || options.html
          options.html = options.html || options.text

          const msg = [
            'from',
            'to',
            'cc',
            'bcc',
            'subject',
            'text',
            'html',
            'attachments'
          ]

          transporter.sendMail(_.pick(options, msg))
            .then(resolve)
            .catch(error => reject(error))
        })
      }
    }
  }
}
