function zeroPadding(text) {
  if (!_.isNumber(text)) {
    throw new Error("invalid argument isn`t a number");
  }

  text = String(text);

  if (!_.isEmpty(text) && text.length == 1) {
    text = "0" + text;
  }

  return text;
}

function load_events(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, false);
  xhr.onload = function(e) {
    callback(JSON.parse(this.response));
  };
  xhr.send(null);
}

var Calendar = function(year, month) {
  var date;

  if ((!_.isUndefined(year) && !_.isNull(year)) && (!_.isUndefined(month) && !_.isNull(month))) {
    date = new Date(year, month - 1);
  } else {
    date = new Date();
  }

  year = date.getFullYear();
  month = date.getMonth();

  var currentMonth = new Date(year, month, 1);
  var currentMonthDaysNum = currentMonth.getDay();

  var monthOfDays = _.range(1,Math.round((new Date(year, month + 1, 1).getTime() - currentMonth.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  var monthOfDaysWeek = monthOfDays.splice(0, 7 - currentMonthDaysNum);
  _.range(currentMonthDaysNum).forEach(function() {
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

  month += 1;

  this._year = year;
  this._month = month;
  this._month_of_days = monthOfDaysWeeks;

  load_events(
    "/api/calendar/" + year + "/" + zeroPadding(month),
    $.proxy(function(res) {
      this.events = res;
    }, this)
  );
};

Calendar.prototype.renderHeaderElement = function(container) {
  var prevControl = $('<td>').append(
    $('<a>').attr("href", "javascript:void(0)").text('<').click(
      $.proxy(function() {
        new Calendar(this.getYear(), this.getMonth() - 1).render(this.options);
      }, this)
    )
  );

  var nextControl = $('<td>').css("text-align", "right").append(
    $("<a>").attr("href", "javascript:void(0)").text(">").click(
      $.proxy(function() {
        new Calendar(this.getYear(), this.getMonth() + 1).render(this.options);
      }, this)
    )
  );

  container.append(
    $('<thead>').append(
      $('<tr>').attr("id", "calendar-header").append(
        prevControl,
        $('<td>').attr("colspan", "5").css("text-align", "center").text(this.getYear() + "/" + zeroPadding(this.getMonth())),
        nextControl
      )
    )
  );
};

Calendar.prototype.renderDaysElement = function(monthOfDays ,container) {
  var monthOfDaysElement = $('<tbody>');

  monthOfDays.forEach(
    $.proxy(function(weekOfDays, week) {
      var weekOfDaysElement = $('<tr>');

      weekOfDays.forEach(
        $.proxy(function(weekOfDay) {
          if (weekOfDay === null) {
            weekOfDay = ' ';
          }

          var events = this.events;

          if (_.isArray(events) && events.length > 0) {
            if (_.indexOf(events, weekOfDay) != -1) {
              weekOfDaysElement.append(
                $('<td>').css("padding", "5px").append(
                  $('<a>').attr("href", "/archive/" + this.getYear() + "/" + zeroPadding(this.getMonth()) + "/" + zeroPadding(weekOfDay)).text(zeroPadding(weekOfDay))
                )
              );

              return true;
            }
          }

          weekOfDaysElement.append($('<td>').css("padding", "5px").text(weekOfDay));
        }, this)
      );

      monthOfDaysElement.append(weekOfDaysElement);
    }, this)
  );

  container.append(monthOfDaysElement);
};

Calendar.prototype.render = function(options) {
  if (!_.isObject(options)) {
    throw new Error("invalid argument isn`t defined");
  }

  var renderElement = options.element;

  if (_.isUndefined(renderElement) || !_.isElement(renderElement[0])) {
    throw new Error("invalid options element property isn`t a Element");
  }

  renderElement.html('');

  if (_.isFunction(this.renderHeaderElement)) {
    this.options = options;

    var container = $('<table>').attr("id", "calendar-container").css("width", "180px").css("border", "1px solid black");

    this.renderHeaderElement(container);

    if (_.isFunction(this.renderDaysElement)) {
      this.renderDaysElement(this.getMonthOfDays(), container);

      renderElement.append(container);
    }
  }
};

Calendar.prototype.getYear = function() {
  if (_.has(this, "_year")) {
    return this._year;
  }

  return new Date().getFullYear();
};

Calendar.prototype.getMonth = function() {
  if ("_month" in this) {
    return this._month;
  }

  return (new Date().getMonth() + 1);
};

Calendar.prototype.getDay = function() {
  if ("_day" in this) {
    return this._day;
  }

  return new Date().getDate();
};

Calendar.prototype.getMonthOfDays = function() {
  if ("_month_of_days" in this) {
    return this._month_of_days;
  }

  throw new Error("invalid property");
};
