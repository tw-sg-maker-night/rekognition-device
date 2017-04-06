require('log-timestamp');
let moment = require('moment-timezone');
let momentTimezone = moment().tz("Asia/Singapore");

function Greeting(){
  this.getGreetingAccordingToTime = function(hourOfTheDay) {
    if(hourOfTheDay < 12) {
      return "Good Morning";
    }
    else if (hourOfTheDay >= 22) {
      return "It's way past your bedtime, you should go home";
    }
    else if (hourOfTheDay >= 20) {
      return "What are you still doing in office";
    }
    else if (hourOfTheDay >= 17) {
      return "Good Evening";
    }
    else {
      return "Good Afternoon";
    }
  }

  this.action = function(name) {
    let hourOfTheDay = momentTimezone.hours();
    let response = this.getGreetingAccordingToTime(hourOfTheDay) + ', ' + name;
    console.log(response);

    return response;
  }
}

module.exports = Greeting;
