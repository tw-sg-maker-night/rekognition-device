var moment = require('moment-timezone');
var momentTimezone = moment().tz("Asia/Singapore");

function Birthday(date) {
  let birthDate = moment(date, "YYYY/MM/DD").startOf('day');

  this.isBirthdayToday = function(){
    let today = momentTimezone.startOf('day');
    return (birthDate.isSame(today));
  }
}

module.exports = Birthday;
