test("Calendar.prototype.renderDays", function() {
  var year = 2012;
  var month = 5;
  var container = $('<div>');

  var days = buildDays(new Date(year, month - 1));
  ok(days);

  var cal = new Calendar(year, month);
  ok(cal);

  cal.events = cal.getEvents();
  cal.renderDays(days, container);

  console.log(container.html());

  equal(
    container.html(),
    $('<div>').append(
      $('<tbody>').attr('id', 'calendar-body').append(
        $('<tr>').attr('id', 'calendar-week1').append(
          $('<td>').text(''),
          $('<td>').text(''),
          $('<td>').append(
            $('<a>').attr('href', '/archive/2012/05/01').text('01')
          ),
          $('<td>').text('02'),
          $('<td>').text('03'),
          $('<td>').text('04'),
          $('<td>').text('05')
        ),
        $('<tr>').attr('id', 'calendar-week2').append(
          $('<td>').text('06'),
          $('<td>').text('07'),
          $('<td>').text('08'),
          $('<td>').text('09'),
          $('<td>').text('10'),
          $('<td>').text('11'),
          $('<td>').text('12')
        ),
        $('<tr>').attr('id', 'calendar-week3').append(
          $('<td>').text('13'),
          $('<td>').text('14'),
          $('<td>').text('15'),
          $('<td>').text('16'),
          $('<td>').text('17'),
          $('<td>').text('18'),
          $('<td>').text('19')
        ),
        $('<tr>').attr('id', 'calendar-week4').append(
          $('<td>').text('20'),
          $('<td>').text('21'),
          $('<td>').text('22'),
          $('<td>').text('23'),
          $('<td>').text('24'),
          $('<td>').text('25'),
          $('<td>').text('26')
        ),
        $('<tr>').attr('id', 'calendar-week5').append(
          $('<td>').text('27'),
          $('<td>').text('28'),
          $('<td>').text('29'),
          $('<td>').text('30'),
          $('<td>').text('31'),
          $('<td>').text(''),
          $('<td>').text('')
        )
      )
    ).html()
  );

  raises(function() { cal.renderDays({}) });
  raises(function() { cal.renderDays([1, 2, 3]) });

  cal.renderDay = 'dummy';

  raises(function() { cal.renderDays(days, container) });
});
