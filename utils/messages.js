const moment = require('moment');

const formatMessage = (username, msg) => {
    return {
        username,
        msg,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;