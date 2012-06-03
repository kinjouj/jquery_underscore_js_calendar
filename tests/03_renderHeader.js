var date = new Date();

test("Calendar.prototype.renderHeader", function() {
  var root = $("<div>");
  var container = $("<table>");

  var cal = new Calendar();
  cal.renderHeader(root, container);

  equal(
    container.html(),
    $("<table>").append(
      $("<thead>").attr("id", "calendar-header").append(
        $("<tr>").append(
          $("<td>").attr("id", "calendar-control-previous").append(
            $("<a>").attr("href", "javascript:void(0)").text("<")
          ),
          $("<td>").attr("id", "calendar-label").attr("colspan", "5").text(
            date.getFullYear() + "/" + (zeroPadding(date.getMonth() + 1))
          ),
          $("<td>").attr("id", "calendar-control-next").append(
            $("<a>").attr("href", "javascript:void(0)").text(">")
          )
        )
      )
    ).html()
  );

  raises(function() { cal.renderHeader() });
  raises(function() { cal.renderHeader(root); });
  raises(function() { cal.renderHeader(root, "dummy"); });
  raises(function() { cal.renderHeader("dummy", container); });

  cal.date = "dummy";

  raises(function() { cal.renderHeader(root, container) });
});
