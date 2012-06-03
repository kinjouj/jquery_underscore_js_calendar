test("buildDays -> 2012/5", function() {
  var days = buildDays(new Date(2012, 4));
  ok(days);
  equal(days.length, 5);

  var days_week1 = days.shift();
  ok(days_week1);
  equal(days_week1.length, 7);
  deepEqual(days_week1, [ null, null, 1, 2, 3, 4, 5]);

  var days_week2 = days.shift();
  ok(days_week2);
  equal(days_week2.length, 7);
  deepEqual(days_week2, _.range(6, 13));

  var days_week3 = days.shift();
  ok(days_week3);
  equal(days_week3.length, 7);
  deepEqual(days_week3, _.range(13, 20));

  var days_week4 = days.shift();
  ok(days_week4);
  equal(days_week4.length, 7);
  deepEqual(days_week4, _.range(20, 27));

  var days_week5 = days.shift();
  ok(days_week5);
  equal(days_week5.length, 7);
  deepEqual(days_week5, [ 27, 28, 29, 30, 31, null, null]);
});

test("buildDays -> 2012/2", function() {
  var days = buildDays(new Date(2012,1));
  ok(days);
  equal(days.length, 5);

  var days_week1 = days.shift();
  ok(days_week1);
  equal(days_week1.length, 7);
  deepEqual(days_week1, [ null, null, null, 1, 2, 3, 4 ]);

  var days_week2 = days.shift();
  ok(days_week2);
  equal(days_week2.length, 7);
  deepEqual(days_week2, _.range(5, 12));

  var days_week3 = days.shift();
  ok(days_week3);
  equal(days_week3.length, 7);
  deepEqual(days_week3, _.range(12, 19));

  var days_week4 = days.shift();
  ok(days_week4);
  equal(days_week4.length, 7);
  deepEqual(days_week4, _.range(19, 26));

  var days_week5 = days.shift();
  ok(days_week5);
  equal(days_week5.length, 7);
  deepEqual(days_week5, [ 26, 27, 28, 29, null, null, null ]);
});

test("buildDays -> failure tests", function() {
  raises(function() { buildDays() });
  raises(function() { buildDays("dummy") });
});
