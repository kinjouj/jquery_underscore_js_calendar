"use strict";

function zeroPadding(n) {
  if (_.isNumber(n) && n > 0 && n <= 9) {
    return "0" + n;
  }

  return n;
}

function buildDays(date) {
  if (!_.isDate(date)) {
    throw new Error("invalid argument: date isn`t a Date");
  }

  var cDate = new Date(date.getFullYear(), date.getMonth(), 1);
  var nDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  var currentMonthDaysLength = Math.round((nDate.getTime() - cDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  var monthOfDays = _.range(1, currentMonthDaysLength);
  var monthOfDaysWeek = monthOfDays.splice(0, 7 - cDate.getDay());

  _.range(cDate.getDay()).forEach(function() {
    monthOfDaysWeek.unshift(null);
  });

  var monthOfDaysWeeks = new Array;
  monthOfDaysWeeks.push(monthOfDaysWeek);

  while (monthOfDays.length > 0) {
    monthOfDaysWeek = monthOfDays.splice(0,7);

    if (monthOfDaysWeek.length < 7) {
      _.range(7 - monthOfDaysWeek.length).forEach(function() {
        monthOfDaysWeek.push(null);
      });
    }

    monthOfDaysWeeks.push(monthOfDaysWeek);
  }

  return monthOfDaysWeeks;
}

var Calendar = function(year, month) {
  var date = new Date();

  if ((_.isNumber(year) && year > 0) && (_.isNumber(month) && month >= 0)) {
    date = new Date(year, month - 1);
  }

  this.date = date;
};

Calendar.prototype.renderHeader = function(root, container) {
  if ((_.isUndefined(root) || _.isNull(root)) || !_.isElement(root[0])) {
    throw new Error("invalid attribute: element isn`t a Element");
  }

  if ((_.isUndefined(container) || _.isNull(container)) || !_.isElement(container[0])) {
    throw new Error("invalid argument: container isn`t a Element");
  }

  if (!_.isDate(this.date)) {
    throw new Error("invalid property: date isn`t a Date");
  }

  var curYear = this.date.getFullYear();
  var curMonth = this.date.getMonth();

  var prevControl = $("<td>").attr("id", "calendar-control-previous").append(
    $("<a>").attr("href", "javascript:void(0)").text("<").click(
      $.proxy(function() {
        console.log(root);

        var prevDate = new Date(curYear, curMonth - 1);
        var prevYear = prevDate.getFullYear();

        if (curYear !== prevYear) {
          this.events = null;
        }

        this.date = new Date(prevYear, prevDate.getMonth());

        this.render(root);
      }, this)
    )
  );

  var nextControl = $("<td>").attr("id", "calendar-control-next").append(
    $("<a>").attr("href", "javascript:void(0)").text(">").click(
      $.proxy(function() {
        if (!_.isFunction(this.render)) {
          return;
        }

        var nextDate = new Date(curYear, curMonth + 1);
        var nextYear = nextDate.getFullYear();

        if (curYear !== nextYear) {
          this.events = null;
        }

        this.date = new Date(nextYear, nextDate.getMonth());

        this.render(root);
      }, this)
    )
  );

  container.append(
    $("<thead>").attr("id" , "calendar-header").append(
      $("<tr>").append(
        prevControl,
        $("<td>").attr("id", "calendar-label").attr("colspan", "5").text(
          curYear + "/" + zeroPadding(curMonth + 1)
        ),
        nextControl
      )
    )
  );
};

Calendar.prototype.renderDays = function(monthOfDays, container) {
  if (!_.isArray(monthOfDays)) {
    throw new Error("invalid argument: monthOfDays isn`t a Array");
  }

  if ((_.isUndefined(container) || _.isNull(container)) || !_.isElement(container[0])) {
    throw new Error("invalid argument: container isn`t a Element");
  }

  if (!_.isFunction(this.renderDay)) {
    throw new Error("invalid property: renderDay isn`t a Function");
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
            var ev = events[this.date.getMonth() + 1];

            if (!_.isUndefined(ev) && _.indexOf(ev, weekOfDay) != -1) {
              isEventExists = true;
            }
          }

          this.renderDay(weekOfDaysElement, weekOfDay, isEventExists);
        }, this)
      );

      monthOfDaysElement.append(weekOfDaysElement);
    }, this)
  );

  container.append(monthOfDaysElement);
};

Calendar.prototype.renderDay = function(element, day, isEventExists) {
  if ((_.isUndefined(element) || _.isNull(element)) || !_.isElement(element[0])) {
    throw new Error("invalid argument: element isn`t a jQuery Element");
  }

  if (!_.isDate(this.date)) {
    throw new Error("invalid property: date ins`t a Date");
  }

  if (!_.isBoolean(isEventExists)) {
    isEventExists = false;
  }

  var dayElement = $('<td>');

  if (_.isNumber(day) && isEventExists === true) {
    var link = "/archive/" + this.date.getFullYear() + "/" + zeroPadding(this.date.getMonth() + 1) + "/" + zeroPadding(day);

    dayElement.append($("<a>").attr("href", link).text(zeroPadding(day)));
  } else {
    if (_.isUndefined(day) || _.isNull(day)) {
      day = "";
    }

    dayElement.text(zeroPadding(day));
  }

  element.append(dayElement);
};

Calendar.prototype.render = function(root) {
  if ((_.isUndefined(root) || _.isNull(root)) || !_.isElement(root[0])) {
    throw new Error("invalid argument: root isn`t a Element");
  }

  if (!_.isDate(this.date)) {
    throw new Error("invalid property: date isn`t a Date");
  }

  if (!_.isFunction(this.getEvents)) {
    throw new Error("invalid property: getEvents isn`a a Function");
  }

  if (!_.isFunction(this.renderHeader)) {
    throw new Error("invalid property: renderHeader isn`t a Function");
  }

  if (!_.isFunction(this.renderDays)) {
    throw new Error("invalid property: renderDays isn`t a Function");
  }

  if (!_.isObject(this.events)) {
    this.events = this.getEvents();
  }

  var container = $("<table>").attr("id", "calendar-container");

  root.children(container).remove();

  this.renderHeader(root, container);
  this.renderDays(buildDays(this.date), container);

  root.append(container);
};

Calendar.prototype.getEventLoaderURL = function() {
  if (!_.isDate(this.date)) {
    throw new Error("invalid property: date isn`t a Date");
  }

  return "/api/calendar/" + this.date.getFullYear();
};

Calendar.prototype.getEvents = function() {
  var events = {};

  try {
    if (!_.isFunction(this.getEventLoaderURL)) {
      throw new Error("invalid property: getEventLoaderURL isn`t a Function");
    }

    var url = this.getEventLoaderURL();

    if (!_.isString(url)) {
      throw new Error("getEventLoaderURL returned isn`t a String");
    }

    console.info("[URL]: " + url);

    var res = $.ajax({
      "url": url,
      "async": false,
      "type": "GET",
      "dataType": "json",
      "error": function(x, s, e) {
        throw e;
      }
    });

    if (res.status === 200) {
      var json = JSON.parse(res.responseText);

      if (_.isObject(json) && !_.isArray(json)) {
        events = JSON.parse(res.responseText);
      }
    }
  } catch(e) {
    console.warn(e.toString());
  };

  return events;
};
