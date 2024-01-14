// const axios = require('axios')
import courses from ('./schedule')

var phoneData = {

}

console.log(courses);

var isWeeks = true

// currently hard-coded (automatically set to the last monday and first 1st of a month)
var weekStartDate = new Date(2024, 0, 14, 0, 0, 0, 0);
var monthStartDate = new Date(2024, 0, 1);

// making the current week's intervals
var currentWeek = []
for (let i = 0; i < 7; i++) currentWeek.push([weekStartDate + i * (1000 * 60 * 60 * 24), weekStartDate + (i+1) * (1000 * 60 * 60 * 24) - 1]);

// making the intervals in every day of this month
var currentMonth = []
var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
for (let i = 0; i < monthDays[0]; i++) currentMonth.push([monthStartDate + i * (1000 * 60 * 60 * 24), monthStartDate + (i+1) * (1000 * 60 * 60 * 24) - 1]);

// for (int i = 0; i < days[])

const screenData = [
    { day: 'Monday', minutes: 10 },
    { day: 'Tuesday', minutes: 20 },
    { day: 'Wednesday', minutes: 40 },
    { day: 'Thursday', minutes: 80 },
    { day: 'Friday', minutes: 40 },
    { day: 'Saturday', minutes: 20 },
    { day: 'Sunday', minutes: 10 }
];

const testData = [
    { assignment_name: 'Goober Trooper', x: 'Monday', y: '100'},
    { assignment_name: 'Roober Roober', x: 'Tuesday', y: '80'},
    { assignment_name: 'Uber Super', x: 'Friday', y: '95'},
];

// nextDate and prevDate
const prevDate = document.getElementById("prevDate");
const nextDate = document.getElementById("nextDate");
const displayed_range = document.getElementById("displayed_range");
const weekOrMonth = document.getElementById("week-or-month");

prevDate.addEventListener("click", () => {
    if (isWeeks) weekStartDate.setDate(weekStartDate.getDate() - 7)
    else monthStartDate.setMonth(monthStartDate.getMonth() - 1)

    update_displayed_range();
    console.log(weekStartDate)
})
nextDate.addEventListener('click', () => {
    if (isWeeks) weekStartDate.setDate(weekStartDate.getDate() + 7)
    else monthStartDate.setMonth(monthStartDate.getMonth() + 1)

    update_displayed_range();
    console.log(weekStartDate)
})
weekOrMonth.addEventListener('click', () => {
    if (weekOrMonth.value == "weekly_option") isWeeks = true;
    else isWeeks = false;
    update_displayed_range();
})

var formatShortDate = (date) => {
    // Ensure the input is a Date object
    if (!(date instanceof Date)) {
      throw new Error('Invalid date');
    }
  
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const suffix = getNumberSuffix(dayOfMonth);

    function getNumberSuffix(number) {
        if (number >= 11 && number <= 13) {
          return 'th';
        }
        const lastDigit = number % 10;
        switch (lastDigit) {
          case 1:
            return 'st';
          case 2:
            return 'nd';
          case 3:
            return 'rd';
          default:
            return 'th';
        }
      }
  
    return `${month}, ${dayOfWeek} the ${dayOfMonth}${suffix}, ${year}`;
  }

  function getLastDateOfMonth(firstDateOfMonth) {
    // Ensure the input is a Date object
    if (!(firstDateOfMonth instanceof Date)) {
      throw new Error('Invalid date');
    }
  
    // Get the year and month of the first date
    const year = firstDateOfMonth.getFullYear();
    const month = firstDateOfMonth.getMonth();
  
    // Create a new date for the first day of the next month
    const firstDayOfNextMonth = new Date(year, month + 1, 1);
  
    // Subtract one day to get the last day of the current month
    const lastDateOfMonth = new Date(firstDayOfNextMonth - 1);
  
    return lastDateOfMonth;
  }

var update_displayed_range = () => {
    weekEndDate = new Date(weekStartDate.getTime())
    weekEndDate.setDate(weekStartDate.getDate() + 6);
    monthEndDate = getLastDateOfMonth(monthStartDate);

    if (isWeeks) displayed_range.innerHTML = formatShortDate(weekStartDate) + " - " + formatShortDate(weekEndDate);
    else displayed_range.innerHTML = formatShortDate(monthStartDate) + " - " + formatShortDate(monthEndDate);

    currentWeek = []
    for (let i = 0; i < 7; i++) currentWeek.push([weekStartDate + i * (1000 * 60 * 60 * 24), weekStartDate + (i+1) * (1000 * 60 * 60 * 24) - 1]);

    currentMonth = []
    for (let i = 0; i < monthDays[0]; i++) currentMonth.push([monthStartDate + i * (1000 * 60 * 60 * 24), monthStartDate + (i+1) * (1000 * 60 * 60 * 24) - 1]);

    update_chart();
}

var update_chart = () => {
    // actually drawing the graph; this part should work
    var canvas = document.getElementById('graph')
    var ctx = document.getElementById('graph').getContext('2d');

    var oldChart = Chart.getChart(ctx)
    if (oldChart) oldChart.destroy();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    type: 'bar',
                    label: 'Screen Time, in Minutes',
                    data: screenData.map(row => ({ x: row.day, y: row.minutes }))
                },
                {
                    label: 'Assignment Marks',
                    data: testData,
                    pointRadius: 8,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'category', // Use 'category' scale for days on the x-axis
                    labels: screenData.map(row => row.day),
                    position: 'bottom',
                },
                y: {
                    display: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {           
                            var data_point = context.dataset.data[context.dataIndex]
    
                            console.log(context.label)
    
                            if (context.label == '') return data_point.assignment_name + ", " + data_point.y + "%";
    
                            return "Minutes Spent: " + context.formattedValue;
                        }
                    }
                }
            }
        }
    });
}

update_chart()