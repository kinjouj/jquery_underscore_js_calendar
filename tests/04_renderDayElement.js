var assert = buster.assertions.assert;

buster.testCase("Calendar Test", {
  "renderDayElement test": function() {
    var container = $('<div>');

    var cal = new Calendar();
    cal.render(container);

    assert.exception(function() { cal.render(); });
    assert.exception(function() { cal.render({}); });
  },
});
