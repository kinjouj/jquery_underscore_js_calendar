test("/api/calendar/2012 request test", function() {
  var cal = new Calendar(2012, 1);
  deepEqual(cal.getEvents(), {
    "1": [1, 3, 5],
    "5": [1]
  });

  cal.getEventLoaderURL = "dummy";

  deepEqual(cal.getEvents(), {});
});

test("/api/calendar/2011 request test", function() {
    var cal = new Calendar(2011, 1);
    deepEqual(cal.getEvents(), {});
});
