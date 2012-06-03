test("Calendar.prototype.constructor", function() {
  var date = new Date();

  var cal = new Calendar();

  equal(cal.date.getFullYear(), date.getFullYear());
  equal(cal.date.getMonth(), date.getMonth());

  cal = new Calendar(2012, 1);

  equal(cal.date.getFullYear(), 2012);
  equal(cal.date.getMonth(), 0);

  cal = new Calendar("A");

  equal(cal.date.getFullYear(), date.getFullYear());
  equal(cal.date.getMonth(), date.getMonth());

  cal = new Calendar(2011, "A");

  equal(cal.date.getFullYear(), date.getFullYear());
  equal(cal.date.getMonth(), date.getMonth());
});
