var expect    = require("chai").expect;
var moment = require('moment-timezone');
var momentTimezone = moment().tz("Asia/Singapore");

var Birthday = require("../../src/actions/birthday");

describe("Birthday", function() {
  let name = "Alice";
  let today = momentTimezone.year('1989').format('YYYY/MM/DD');
  let birthday = new Birthday();

  describe("isBirthdayToday", function() {
    it("return true if today is birthday", function() {
      expect(birthday.isBirthdayToday(today)).to.be.true;
    });

    it("return false if today is not birthday", function() {
      let yesterday = momentTimezone.clone().subtract(1, 'days').format('YYYY/MM/DD');
      expect(birthday.isBirthdayToday(yesterday)).to.be.false;

      let tomorrow = momentTimezone.clone().add(1, 'days').format('YYYY/MM/DD');
      expect(birthday.isBirthdayToday(tomorrow)).to.be.false;
    });
  });

  describe("getBirthdaySong", function() {
    it("return customized birthday song", function(){
      expect(birthday.getBirthdaySong(name)).to.eql(
        "Happy birthday to you, happy birthday to you, happy birthday to Alice. Happy birthday to you.");
    });
  });
});
