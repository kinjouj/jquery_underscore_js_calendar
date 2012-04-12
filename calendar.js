String.prototype.format = function() {
  var formatted = this;

  for(arg in arguments) {
    formatted = formatted.replace("{" + arg + "}", arguments[arg]);
  }

  return formatted;
};

var Calendar = function(element, date) {
  if (element === undefined || element === null) {
    throw new Error("undefined element argument");
  }

  if (date === undefined || date === null) {
    date = new Date();
  }


  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();

  var current_month = new Date(year, month, 1);
  var next_month = new Date(year, month + 1, 1);

  var monthOfDays = _.range(1,Math.round((next_month.getTime() - current_month.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  var monthOfDaysWeeks = new Array;

  while (monthOfDays.length > 0) {
    var monthOfDaysWeek;

    if (monthOfDaysWeeks.length == 0) {
      monthOfDaysWeek = monthOfDays.splice(0,7 - current_month.getDay());

      _.range(current_month.getDay()).forEach(function() {
        monthOfDaysWeek.unshift(null);
      });
    } else {
      monthOfDaysWeek = monthOfDays.splice(0,7);
    }

    monthOfDaysWeeks.push(monthOfDaysWeek);
  }

  this._element = element;
  this._year = year;
  this._month = month + 1;
  this._day = day;
  this._month_of_days = monthOfDaysWeeks;
};

Calendar.prototype.render = function() {
  var renderElement = this.getRenderElement();
  renderElement.html('');

  var headerRenderer = function(year, month) {
    return $('<thead>').append($('<tr>').attr("id", "calendar-header").append(
      $('<td>').attr("colspan", "7").css("text-align", "center").text(year + "/" + month)
    ));
  };

  var monthOfDaysElement = $('<tbody>');

  this.getMonthOfDays().forEach(function(weekOfDays, week) {
    var weekOfDaysElement = $('<tr>');

    weekOfDays.forEach(function(weekOfDay) {
      if (weekOfDay === null) {
        weekOfDay = ' ';
      }

      weekOfDaysElement.append($('<td>').text(weekOfDay));
    });

    monthOfDaysElement.append(weekOfDaysElement);
  });

  var container = $($('<table>').attr("id", "calendar-container").css("width", "200px").css("border", "1px solid black"));
  container.append(headerRenderer(this.getYear(), this.getMonth()), monthOfDaysElement);

  renderElement.append(container);
};

Calendar.prototype.getRenderElement = function() {
  if ("_element" in this) {
    return this._element;
  }

  throw new Error("invalid property");
};

Calendar.prototype.getYear = function() {
  if ("_year" in this) {
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
