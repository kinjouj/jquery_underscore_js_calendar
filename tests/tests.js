var assert = buster.assertions.assert;

buster.testCase("Calendar Test", {
  "zeroPadding test": function() {
    assert.equals(zeroPadding(1), "01");
    assert.equals(zeroPadding(12), "12");
    assert.equals(zeroPadding(), undefined);
    assert.equals(zeroPadding(null), null);
  },
  "Construtor test": function() {

  },
  "getEventLoaderURL test": function() {
    var cal = new Calendar();

    assert.equals(cal.getEventLoaderURL(2012), "/api/calendar/2012");

    assert.exception(function() { cal.getEventLoaderURL(); });
    assert.exception(function() { cal.getEventLoaderURL(null); });
  },
  "renderHeaderElement test": function() {
    var root = $('<div>');
    var container = $('<table>');

    var cal = new Calendar();
    cal.renderHeaderElement(root, container);

    assert.equals(
      container.html(),
      $('<table>').append(
        $('<thead>').attr("id", "calendar-header").append(
          $('<tr>').append(
            $('<td>').append($('<a>').attr("href", "javascript:void(0)").text("<")),
            $('<td>').attr("colspan", "5").css("text-align", "center").text("2012/04"),
            $('<td>').css("text-align", "right").append(
              $('<a>').attr("href", "javascript:void(0)").text(">")
            )
          )
        )
      ).html()
    );
  },
  "render test": function() {
    var container = $('<div>');

    var cal = new Calendar();
    cal.render(container);

    assert.exception(function() { cal.render(); });
    assert.exception(function() { cal.render({}); });
  }
});
