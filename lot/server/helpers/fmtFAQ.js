'use strict'

module.exports = {
  // FAQ content
  login: () => { // make trailing email address copyable to clipboard by click!
    return {
      text: 'To log in, please use the login details provided by Konica ' +
             'Minolta.\nIf you do not have your login credentials, ' +
             'please get in touch with customerportal@konicaminolta.eu.',
      quickCopies: [ 'customerportal@konicaminolta.eu' ]
    }
  },
  resetPassword: () => {
    return {
      text: 'To reset or change your password, please visit below link',
      links: [{
        href: 'https://infohub.konicaminolta.eu',
        text: 'infohub.konicaminolta.eu'
      }]
    }
  },
  howItWorks: () => {
    return {
      text: 'bizView displays up to date information on global inventory, ' +
            'globally invoiced print-volume and global spendings. ' +
            'The source of this data are the country´s ERP systems.'
    }
  },
  infoAccuracy: () => {
    return {
      text: 'bizView`s data is being updated daily, which allows to display ' +
            'data that is not older than 24 hours.'
    }
  },
  dataSecurity: () => {
    return {
      text: 'To read more about bizView`s data security, please have a look ' +
            'at the Security Whitepaper linked below',
      links: [{
        href: 'https://bizview-test.konicaminolta.eu/res/docs/' +
              'BEU_bizView_Security_Whitepaper_V1.0.pdf',
        text: 'Security Whitepaper'
      }]
    }
  }
}
