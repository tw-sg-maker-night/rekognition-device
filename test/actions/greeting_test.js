var expect    = require("chai").expect;
var moment = require('moment-timezone');
var momentTimezone = moment().tz("Asia/Singapore");

var Greeting = require("../../src/actions/greeting");

describe("Greeting", function() {
  let name = "Alice";
  let greeting = new Greeting();

  describe("getGreetingAccordingToTime", function() {
    it("return Good Morning if now is before 12pm", function(){
      expect(greeting.getGreetingAccordingToTime(11)).to.eql("Good Morning");
    });

    it("return Good Afternoon if now is between 12pm and 4pm", function(){
      expect(greeting.getGreetingAccordingToTime(12)).to.eql("Good Afternoon");
      expect(greeting.getGreetingAccordingToTime(16)).to.eql("Good Afternoon");
    });

    it("return Good Evening if now is between 5pm and 7pm", function(){
      expect(greeting.getGreetingAccordingToTime(17)).to.eql("Good Evening");
      expect(greeting.getGreetingAccordingToTime(19)).to.eql("Good Evening");
    });

    it("return a gentle reminder prompt if now is between 8pm and 9pm", function(){
      expect(greeting.getGreetingAccordingToTime(20)).to.eql("What are you still doing in office");
      expect(greeting.getGreetingAccordingToTime(21)).to.eql("What are you still doing in office");
    });

    it("return a tough love scolding if now is 10pm and later", function(){
      expect(greeting.getGreetingAccordingToTime(22)).to.eql("It's way past your bedtime, you should go home");
      expect(greeting.getGreetingAccordingToTime(23)).to.eql("It's way past your bedtime, you should go home");
    });
  });

  describe("action", function(){
    it("return a message with the user name", function(){
      expect(greeting.action(name)).to.contains(name);
    });
  });
});
