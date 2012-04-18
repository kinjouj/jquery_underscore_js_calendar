var assert = buster.assertions.assert;

buster.testCase("Calendar Test", {
  "getEventLoaderURL test": function() {
    var cal = new Calendar();

    assert.equals(cal.getEventLoaderURL(2012), "/api/calendar/2012");

    assert.exception(function() { cal.getEventLoaderURL(); });
    assert.exception(function() { cal.getEventLoaderURL(null); });
  }
});
