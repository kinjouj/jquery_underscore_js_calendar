var assert = buster.assertions.assert;

var container = $('<div>');

buster.testCase("Calendar Test", {
  "zeroPadding test": function() {
    assert.equals(zeroPadding(1), "01");
    assert.equals(zeroPadding(12), "12");

    assert.exception(function() { zeroPadding(); });
    assert.exception(function() { zeroPadding(null); });
  },
  "getEventLoaderURL test": function() {
    var cal = new Calendar();

    assert.equals(cal.getEventLoaderURL(2012,4), "/api/calendar/2012/04");

    assert.exception(function() { cal.getEventLoaderURL() });
  },
  "render test": function() {
    var cal = new Calendar();
    cal.render(container);

    assert.exception(function() { cal.render(); });
    assert.exception(function() { cal.render({}); });
  }
});
