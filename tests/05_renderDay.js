test("Calendar.prototype.renderDay", function() {
  var cal = new Calendar();

  var el1 = $("<tr>");
  cal.renderDay(el1, 1);

  equal(
    el1.html(),
    $("<tr>").append(
      $("<td>").text("01")
    ).html()
  );

  var el2 = $("<tr>");
  cal.renderDay(el2, 10);

  equal(
    el2.html(),
    $("<tr>").append(
      $("<td>").text("10")
    ).html()
  );
});

test("Calendar.prototype.renderDay -> isEventExists is true", function() {
    var cal = new Calendar(2012, 1);

    var el1 = $("<tr>");
    cal.renderDay(el1, 1, true);

    equal(
      el1.html(),
      $("<tr>").append(
        $("<td>").append(
          $("<a>").attr("href", "/archive/2012/01/01").text("01")
        )
      ).html()
    );

    var el2 = $("<tr>");
    cal.renderDay(el2, 1, "dummy");

    equal(
      el2.html(),
      $("<tr>").append(
        $("<td>").text("01")
      ).html()
    );
  }
);

test("Calendar.prototype.renderDay -> failure tests", function() {
  var cal = new Calendar();

  raises(function() { cal.renderDay() });
  raises(function() { cal.renderDay("dummy") });

  cal.date = "dummy";

  raises(function() { cal.renderDay($("<tr>"), 1) });
});
