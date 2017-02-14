var moment = require('moment-timezone');
var momentTimezone = moment().tz("Asia/Singapore");

function Birthday() {
  this.isBirthdayToday = function(date){
    let birthDate = moment(date, "YYYY/MM/DD").startOf('day').format('MM-DD');
    let today = momentTimezone.startOf('day').format('MM-DD');
    return (birthDate === today);
  }

  this.getBirthdaySong = function(name) {
    return "Happy birthday to you, happy birthday to you, happy birthday to " +
      name + ". Happy birthday to you."
  }

  this.action = function(name, date) {
    console.log("Birthday module called. Date: " + date + ", Name: " + name);

    if(date === undefined || name === undefined)
      return null;

    if(this.isBirthdayToday(date))
      return this.getBirthdaySong(name);

    return null;
  }
}

module.exports = Birthday;
