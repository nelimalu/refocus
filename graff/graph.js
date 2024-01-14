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

var ctx = document.getElementById('graph').getContext('2d');

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
                display: false
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
