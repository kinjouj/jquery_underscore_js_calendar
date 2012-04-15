"use strict";

function zeroPadding(n) {
  if (_.isNumber(n) && n > 0 && n <= 9) {
    return "0" + n;
  }

  return n;
}

var Calendar = function(year, month, events) {
  var date = new Date();

  if (_.isNumber(year) && _.isNumber(month)) {
    date = new Date(year, month);
  }

  year = date.getFullYear();
  month = date.getMonth();

  var currentMonth = new Date(year, month, 1);
  var currentMonthDaysLength = Math.round((new Date(year, month + 1, 1).getTime() - currentMonth.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  var monthOfDays = _.range(1, currentMonthDaysLength);
  var monthOfDaysWeek = monthOfDays.splice(0, 7 - currentMonth.getDay());
  _.range(currentMonth.getDay()).forEach(function() {
    monthOfDaysWeek.unshift(null);
  });

  var monthOfDaysWeeks = new Array;
  monthOfDaysWeeks.push(monthOfDaysWeek);

  while (monthOfDays.length > 0) {
    monthOfDaysWeek = monthOfDays.splice(0, 7);

    if (monthOfDaysWeek.length < 7) {
      _.range(7 - monthOfDaysWeek.length).forEach(function() {
        monthOfDaysWeek.push(null);
      });
    }

    monthOfDaysWeeks.push(monthOfDaysWeek);
  }

  if (!_.isObject(events)) {
    events = this.eventLoader(year, month + 1);
  }

  this.year = year;
  this.month = month;
  this.monthOfDays = monthOfDaysWeeks;
  this.events = events;

  Object.freeze(this);
};

Calendar.prototype.renderHeaderElement = function(root, container) {
  if (!_.isElement(container[0])) {
    throw new Error("invalid argument: container isn`t a jQuery Element");
  }

  if (!_.isElement(root[0])) {
    throw new Error("invalid attribute: element isn`t a Element");
  }

  if (!_.isNumber(this.year)) {
    throw new Error("invalid attribute: year isn`t a number");
  }

  if (!_.isNumber(this.month)) {
    throw new Error("invalid attribute: month isn`t a number");
  }

  var curYear = new Date(this.year, this.month).getFullYear();

  var prevControl = $("<td>").append(
    $("<a>").attr("href", "javascript:void(0)").text("<").click($.proxy(function() {
        var prevDate = new Date(this.year, this.month - 1);
        var events = this.events;

        if (curYear !== prevDate.getFullYear()) {
          events = null;
        }

        new Calendar(prevDate.getFullYear(), prevDate.getMonth(), events).render(root);
      }, this))
  );

  var nextControl = $("<td>").css("text-align", "right").append(
    $("<a>").attr("href", "javascript:void(0)").text(">").click(
      $.proxy(function() {
        var nextDate = new Date(this.year, this.month + 1);
        var events = this.events;

        if (curYear !== nextDate.getFullYear()) {
          events = null;
        }

        new Calendar(nextDate.getFullYear(), nextDate.getMonth(), events).render(root);
      }, this)
    )
  );

  container.append(
    $("<thead>").attr("id" , "calendar-header").append(
      $("<tr>").append(
        prevControl,
        $("<td>").attr("colspan", "5").css("text-align", "center").text(this.year + "/" + zeroPadding(this.month + 1)),
        nextControl
      )
    )
  );
};

Calendar.prototype.renderDaysElement = function(monthOfDays, container) {
  var monthOfDaysElement = $("<tbody>").attr("id", "calendar-body");

  monthOfDays.forEach(
    $.proxy(function(weekOfDays, week) {
      var weekOfDaysElement = $("<tr>");

      weekOfDays.forEach(
        $.proxy(function(weekOfDay) {
          if (weekOfDay === null) {
            weekOfDay = " ";
          }

          var events = this.events;

          if (_.isObject(events)) {
            var event = events[this.month + 1];

            if (!_.isUndefined(event) && _.indexOf(event, weekOfDay) !== -1) {
              weekOfDay = zeroPadding(weekOfDay);

              var hrefValue = "/archive/" + this.year + "/" + zeroPadding(this.month) + "/" + weekOfDay;

              weekOfDaysElement.append(
                $("<td>").append(
                  $("<a>").attr("href", hrefValue).text(weekOfDay)
                )
              );

              return true;
            }
          }

          weekOfDaysElement.append(
            $("<td>").text(zeroPadding(weekOfDay))
          );
        }, this)
      );

      monthOfDaysElement.append(weekOfDaysElement);
    }, this)
  );

  container.append(monthOfDaysElement);
};

Calendar.prototype.render = function(root) {
  if (!_.isElement(root[0])) {
    throw new Error("invalid argument: root isn`t a Element");
  }

  root.children($('<table>')).remove();

  if (_.isFunction(this.renderHeaderElement)) {
    var container = $("<table>").attr("id", "calendar-container");

    this.renderHeaderElement(root, container);

    if (_.isFunction(this.renderDaysElement)) {
      this.renderDaysElement(this.monthOfDays, container);

      root.append(container);
    }
  }
};

Calendar.prototype.getEventLoaderURL = function(year) {
  if (!_.isNumber(year)) {
    throw new Error("invalid argument: year isn`t a number");
  }

  return "/api/calendar/" + year;
};

Calendar.prototype.getEventsResponse = function(url) {
  if (!_.isString(url)) {
    throw new Error("invalid argument: url isn`t a string");
  }

  console.info(url);

  var res = $.ajax({
    "url": url,
    "async": false,
    "type": "GET",
    "dataType": "json",
    "error": function(xhr, status, e) {
      throw e;
    }
  });

  if (res.status == 200) {
    return res.responseText;
  }

  return null;
};

Calendar.prototype.eventLoader = function(year) {
  if (!_.isNumber(year)) {
    throw new Error("invalid argument: year isn`t a number");
  }

  var events = null;

  try {
    var url = this.getEventLoaderURL(year);

    if (!_.isString(url)) {
      throw new Error("getEventLoaderURL returned isn`t a String");
    }

    var res = this.getEventsResponse(url);

    events = JSON.parse(res);
  } catch(e) {
    console.warn(e);
  };

  return events;
};
