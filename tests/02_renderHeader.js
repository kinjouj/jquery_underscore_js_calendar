var assert = buster.assertions.assert;
var date = new Date();

buster.testCase("Calendar#renderHeader", {
  "rendered html test": function() {
    var root = $('<div>');
    var container = $('<table>');

    var cal = new Calendar();
    cal.renderHeader(root, container);

    assert.equals(
      container.html(),
      $('<table>').append(
        $('<thead>').attr("id", "calendar-header").append(
          $('<tr>').append(
            $('<td>').attr("id", "calendar-control-previous").append(
              $('<a>').attr("href", "javascript:void(0)").text("<")
            ),
            $('<td>').attr("id", "calendar-label").attr("colspan", "5").text(
              date.getFullYear() + "/" + (zeroPadding(date.getMonth() + 1))
            ),
            $('<td>').attr("id", "calendar-control-next").append(
              $('<a>').attr("href", "javascript:void(0)").text(">")
            )
          )
        )
      ).html()
    );
  },
  "failure tests": function() {
    var cal = new Calendar();
    var root = $('<div>');
    var container = $('<table>');

    assert.exception(function() { cal.renderHeader(); });
    assert.exception(function() { cal.renderHeader(root); });
    assert.exception(function() { cal.renderHeader(root, 'dummy'); });
    assert.exception(function() { cal.renderHeader('dummy', container); });
  }
});
