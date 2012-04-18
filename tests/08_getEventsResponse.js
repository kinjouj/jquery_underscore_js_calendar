var assert = buster.assertions.assert;

buster.testCase("Calendar Test", {
  "getEventsResponse test": function() {
    console.info_b = console.info;

    console.info = function(message) {
      assert.equals(message, "/api/calendar/2012");
    };

    var cal = new Calendar();
    var res1 = cal.getEventsResponse("/api/calendar/2012");

    assert(res1);
    assert.equals(JSON.parse(res1), { "4": [1,3,5] });

    console.info = function(message) {
      assert.equals(message, "/api/calendar/2013");
    };

    assert.equals(cal.getEventsResponse("/api/calendar/2013"), null);

    assert.exception(function() { cal.getEventsResponse() });
    assert.exception(function() { cal.getEventsResponse(null); });
    assert.exception(function() { cal.getEventsResponse(""); });

    console.info = console.info_b;
  }
});
