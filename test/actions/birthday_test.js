var expect    = require("chai").expect;
var moment = require('moment-timezone');
var momentTimezone = moment().tz("Asia/Singapore");

var Birthday = require("../../src/actions/birthday");

describe("Birthday", function() {
  describe("isBirthdayToday", function() {
    it("return true if today is birthday", function() {
      let today = momentTimezone.format('YYYY/MM/DD');
      let birthday = new Birthday(today);

      expect(birthday.isBirthdayToday()).to.be.true;
    });

    it("return false if today is not birthday", function() {
      let yesterday = momentTimezone.clone().subtract(1, 'days').format('YYYY/MM/DD');
      let yesterdayBirthday = new Birthday(yesterday);
      expect(yesterdayBirthday.isBirthdayToday()).to.be.false;

      let tomorrow = momentTimezone.clone().add(1, 'days').format('YYYY/MM/DD');
      let tomorrowBirthday = new Birthday(tomorrow);
      expect(tomorrowBirthday.isBirthdayToday()).to.be.false;
    });
  });

  describe("getBirthdaySong", function() {
    it("return customized birthday song", function(){
      
    });
  });
});
