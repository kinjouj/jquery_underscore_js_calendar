"use strict";

function zeroPadding(n) {
  if (_.isUndefined(n) || _.isNull(n)) {
    throw new Error("invalid argument: undefined or null");
  }

  if (parseInt(n) === NaN) {
    throw new Error("invalid argument: isn`t a number");
  }

  if (n > 0 && n <= 9) {
    n = "0" + n;
  }

  return n;
}

var Calendar = function(year, month) {
  var date = new Date();

  if (_.isNumber(year) && _.isNumber(month)) {
    date = new Date(year, month - 1);
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

  this.year = year;
  this.month = month + 1;
  this.monthOfDays = monthOfDaysWeeks;
};

Calendar.prototype.renderHeaderElement = function(container) {
  if (!_.isElement(container[0])) {
    throw new Error("invalid argument: container isn`t a jQuery Element");
  }

  var prevControl = $("<td>").append(
    $("<a>").attr("href", "javascript:void(0)").text("<").click(
      $.proxy(function() {
        new Calendar(this.year, this.month - 1).render(this.element);
      }, this)
    )
  );

  var nextControl = $("<td>").css("text-align", "right").append(
    $("<a>").attr("href", "javascript:void(0)").text(">").click(
      $.proxy(function() {
        new Calendar(this.year, this.month + 1).render(this.element);
      }, this)
    )
  );

  container.append(
    $("<thead>").attr("id" , "calendar-header").append(
      $("<tr>").append(
        prevControl,
        $("<td>").attr("colspan", "5").css("text-align", "center").text(this.year + "/" + zeroPadding(this.month)),
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

          if (_.isArray(events) && events.length > 0) {
            if (_.indexOf(events, weekOfDay) !== -1) {
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

Calendar.prototype.render = function(element) {
  if (!_.isElement(element[0])) {
    throw new Error("invalid argument: element isn`t a Element");
  }

  element.children($('<table>')).remove();

  if (_.isFunction(this.renderHeaderElement)) {
    this.element = element;

    var container = $("<table>").attr("id", "calendar-container");

    this.renderHeaderElement(container);

    if (_.isFunction(this.renderDaysElement)) {
      this.events = this.eventLoader(this.year, this.month);
      this.renderDaysElement(this.monthOfDays, container);

      element.append(container);
    }
  }
};

Calendar.prototype.getEventLoaderURL = function(year, month) {
  if (!_.isNumber(year)) {
    throw new Error("invalid argument: year isn`t a number");
  }

  if (!_.isNumber(month)) {
    throw new Error("invalid argument: month isn`t a number");
  }

  return "/api/calendar/" + year + "/" + zeroPadding(month);
};

Calendar.prototype.getEventsResponse = function(url) {
  if (!_.isString(url)) {
    throw new Error("invalid argument: url isn`t a string");
  }

  var res = $.ajax({
    "url": url,
    "async": false,
    "type": "GET"
  });

  if (res.status == 200) {
    return res.responseText;
  }

  return null;
}

Calendar.prototype.eventLoader = function(year, month) {
  if (!_.isNumber(year)) {
    throw new Error("invalid argument: year isn`t a number");
  }

  if (_.isUndefined(month) || _.isNull(month)) {
    throw new Error("invalid argument: month isn`t defined");
  }

  var events = new Array;

  try {
    var url = this.getEventLoaderURL(year, month);

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
