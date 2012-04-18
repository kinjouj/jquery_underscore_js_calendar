"use strict";

function zeroPadding(n) {
  if (_.isNumber(n) && n > 0 && n <= 9) {
    return "0" + n;
  }

  return n;
}

var Calendar = function(year, month, events) {
  var date = new Date();

  if ((_.isNumber(year) && year > 0) && (_.isNumber(month) && month >= 0)) {
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

  if (!_.isObject(events)) {
    events = this.eventLoader(year);
  }

  this.year = year;
  this.month = month;
  this.monthOfDays = monthOfDaysWeeks;
  this.events = events;

  Object.freeze(this);
};



Calendar.prototype.renderHeader = function(root, container) {
  if (!_.isElement(root[0])) {
    throw new Error("invalid attribute: element isn`t a Element");
  }

  if (!_.isElement(container[0])) {
    throw new Error("invalid argument: container isn`t a jQuery Element");
  }

  if (!_.isNumber(this.year)) {
    throw new Error("invalid attribute: year isn`t a number");
  }

  if (!_.isNumber(this.month)) {
    throw new Error("invalid attribute: month isn`t a number");
  }

  var curDate = new Date(this.year, this.month);
  var curYear = curDate.getFullYear();
  var events = this.events;

  var prevControl = $("<td>").attr("id", "calendar-control-previous").append(
    $("<a>").attr("href", "javascript:void(0)").text("<").click(function() {
      var prevDate = new Date(curYear, curDate.getMonth() - 1);
      var prevYear = prevDate.getFullYear();

      if (curYear !== prevYear) {
        events = null;
      }

      new Calendar(prevYear, prevDate.getMonth() + 1, events).render(root);
    })
  );

  var nextControl = $("<td>").attr("id", "calendar-control-next").append(
    $("<a>").attr("href", "javascript:void(0)").text(">").click(function() {
      var nextDate = new Date(curYear, curDate.getMonth() + 1);
      var nextYear = nextDate.getFullYear();

      if (curYear !== nextYear) {
        events = null;
      }

      new Calendar(nextYear, nextDate.getMonth() + 1, events).render(root);
    })
  );

  container.append(
    $("<thead>").attr("id" , "calendar-header").append(
      $("<tr>").append(
        prevControl,
        $("<td>").attr("id", "calendar-label").attr("colspan", "5").text(
          this.year + "/" + zeroPadding(this.month + 1)
        ),
        nextControl
      )
    )
  );
};

Calendar.prototype.renderDaysElement = function(monthOfDays, container) {
  if (!_.isFunction(this.renderDayElement)) {
    throw new Error("invalid property: renderDayElement isn`t a Function");
  }

  var monthOfDaysElement = $("<tbody>").attr("id", "calendar-body");

  monthOfDays.forEach(
    $.proxy(function(weekOfDays, week) {
      var weekOfDaysElement = $("<tr>").attr("id", "calendar-week" + (week + 1));

      weekOfDays.forEach(
        $.proxy(function(weekOfDay) {
          var events = this.events;
          var isEventExists = false;

          if (!_.isNull(weekOfDay) && _.isObject(events)) {
            var ev = events[this.month + 1];

            if (!_.isUndefined(ev) && _.indexOf(ev, weekOfDay) !== -1) {
              isEventExists = true;
            }
          }

          this.renderDayElement(weekOfDaysElement, weekOfDay, isEventExists);
        }, this)
      );

      monthOfDaysElement.append(weekOfDaysElement);
    }, this)
  );

  container.append(monthOfDaysElement);
};

Calendar.prototype.renderDayElement = function(element, day, isEventExists) {
  if (_.isNull(day)) {
    day = ' ';
  }

  if (!_.isBoolean(isEventExists)) {
    isEventExists = false;
  }

  day = zeroPadding(day);

  var dayElement = $('<td>');

  if (isEventExists) {
    var link = "/archive/" + this.year + "/" + zeroPadding(this.month + 1) + "/" + day;

    dayElement.append($('<a>').attr("href", link).text(day));
  } else {
    dayElement.text(day);
  }

  element.append(dayElement);
};

Calendar.prototype.render = function(root) {
  if (!_.isElement(root[0])) {
    throw new Error("invalid argument: root isn`t a Element");
  }

  if (!_.isFunction(this.renderHeader)) {
    throw new Error("invalid property: renderHeader isn`t a Function");
  }

  if (!_.isFunction(this.renderDaysElement)) {
    throw new Error("invalid property: renderDaysElement isn`t a Function");
  }

  var container = $("<table>").attr("id", "calendar-container");

  root.children(container).remove();

  this.renderHeader(root, container);
  this.renderDaysElement(this.monthOfDays, container);

  root.append(container);
};

Calendar.prototype.getEventLoaderURL = function(year) {
  if (!_.isNumber(year)) {
    throw new Error("invalid argument: year isn`t a number");
  }

  return "/api/calendar/" + year;
};

Calendar.prototype.getEventsResponse = function(url) {
  if (!_.isString(url) || _.isEmpty(url)) {
    throw new Error("invalid argument: url isn`t a string");
  }

  console.info(url);

  var data = null

  try {
    var res = $.ajax({ "url": url, "async": false, "type": "GET", "dataType": "json", "error": function(x, s, e) { throw e; } });

    if (res.status == 200) {
      data = res.responseText;
    }
  } catch (e) {
    console.warn(e);
  };

  return data;
};

Calendar.prototype.eventLoader = function(year) {
  if (!_.isNumber(year)) {
    throw new Error("invalid argument: year isn`t a number");
  }

  var events = {};

  try {
    var url = this.getEventLoaderURL(year);

    if (!_.isString(url)) {
      throw new Error("getEventLoaderURL returned isn`t a String");
    }

    var res = this.getEventsResponse(url);

    if (!_.isNull(res)) {
      events = JSON.parse(res);
    }
  } catch(e) {
    console.warn(e);
  };

  return events;
};
