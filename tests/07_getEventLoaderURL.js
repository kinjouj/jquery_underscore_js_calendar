test("Calendar.prototype.getEventLoaderURL", function() {
  var date = new Date();

  var cal1 = new Calendar();
  equal(cal1.getEventLoaderURL(), "/api/calendar/" + date.getFullYear());

  var cal2 = new Calendar(2011, 1);
  equal(cal2.getEventLoaderURL(), "/api/calendar/2011");
});

test('Calendar.prototype.getEventLoaderURL -> failure tests', function() {
  var cal = new Calendar();
  cal.date = "dummy";

  raises(function() { cal.getEventLoaderURL() });
});
