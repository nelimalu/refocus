class Course {
    constructor(name, bgColor) {
        this.name = name;
        this.classTimes = {};
        this.bgColor = bgColor
    }

    updateClassTimes(newClassTime) {
        let i = newClassTime.days.indexOf(newClassTime.start.getDay().toString())
        newClassTime.days = newClassTime.days.slice(i).concat(newClassTime.days.slice(0,i));
        let interval = parseInt(newClassTime.interval);

        for (let j = 0; j < newClassTime.days.length; j++) {
            let diff = newClassTime.days[j]-newClassTime.start.getDay();
            diff += ((diff < 0) ? 7 : 0);
            diff *= 86400000;
            let currentStart = newClassTime.start.getTime() + diff;
            let currentEnd = newClassTime.end.getTime() + diff;
            while (currentEnd < newClassTime.repeatEnd.getTime()) {
                this.classTimes[idCounter] = {
                    course: newClassTime.course,
                    type: newClassTime.type,
                    start: new Date(currentStart),
                    end: new Date(currentEnd),
                }
                ec.addEvent({
                    id: idCounter, 
                    start: new Date(currentStart),
                    end: new Date(currentEnd),
                    title: newClassTime.course+"\n"+newClassTime.type,
                    textColor: "black",
                    backgroundColor: this.bgColor
                });
                idCounter++;
                currentStart += 604800000 * interval;
                currentEnd += 604800000 * interval;
            }
        }

        // console.log(ec.getEvents());
        // console.log(this.classTimes);
    }
}

function openModal(date, mode = 'new', id = -1) {
    // Get modal container and modal box elements
    let modalContainer = document.getElementById('modalContainer');
    let modalBox = document.getElementById('modalBox');

    let formattedStart = date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')
        +'-'+String(date.getDate()).padStart(2,'0')+'T'+String(date.getHours()).padStart(2,'0')
        +':'+String(date.getMinutes()).padStart(2,'0');
    let formattedEnd = date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')
        +'-'+String(date.getDate()).padStart(2,'0')+'T'+String(date.getHours()+1).padStart(2,'0')
        +':'+String(date.getMinutes()).padStart(2,'0');

    if (mode === 'new') {
        modalBox.innerHTML = `
            <span class='modal-title new-title'>
                <p>Add new class</p>
                <button class="close-button" onclick="closeModal()">X</button>
            </span>
            <form class='new-class'>
                <label for="course">Course:</label>
                <select name="course" id="course"></select>
                <br><br>
                <label for="type">Type:</label>
                <select name="type" id="type">
                    <option value="Lecture">Lecture</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Lab">Lab</option>
                    <option value=" ">None</option>
                </select>
                <br><br>
                <label for="start">Start:</label>
                <input type="datetime-local" id="start" value="${formattedStart}">
                <br><br>
                <label for="end">End:</label>
                <input type="datetime-local" id="end" value="${formattedEnd}">
                <br><br>
                <label>Repeat on:</label>
                <input id="sun" type="checkbox" name="repeatDay" value="0" ${date.getDay() === 0 ? 'checked disabled' : ''}>
                <label for="sun">S</label>
                <input id="mon" type="checkbox" name="repeatDay" value="1" ${date.getDay() === 1 ? 'checked disabled' : ''}>
                <label for="mon">M</label>
                <input id="tue" type="checkbox" name="repeatDay" value="2" ${date.getDay() === 2 ? 'checked disabled' : ''}>
                <label for="tue">T</label>
                <input id="wed" type="checkbox" name="repeatDay" value="3" ${date.getDay() === 3 ? 'checked disabled' : ''}>
                <label for="wed">W</label>
                <input id="thu" type="checkbox" name="repeatDay" value="4" ${date.getDay() === 4 ? 'checked disabled' : ''}>
                <label for="thu">T</label>
                <input id="fri" type="checkbox" name="repeatDay" value="5" ${date.getDay() === 5 ? 'checked disabled' : ''}>
                <label for="fri">F</label>
                <input id="sat" type="checkbox" name="repeatDay" value="6" ${date.getDay() === 6 ? 'checked disabled' : ''}>
                <label for="sat">S</label>
                <br><br>
                <label for="repeatInterval">Repeat every:</label>
                <select name="repeatInterval" id="repeat-interval">
                    <option value="1">1 week</option>
                    <option value="2">2 weeks</option>
                </select>
                <br><br>
                <label for="repeat-end">Repeat until:</label>
                <input type="date" id="repeat-end" value="${formattedEnd.substring(0,10)}">
                <br><br>
                <input type="submit" value="Add Class">
            </form>
            `;
        for (let course of courses) {
            option = document.createElement("option");
            option.value = course.name;
            option.text = course.name;
            document.getElementById("course").add(option);
        }
    } else if (mode === 'edit') {
        modalBox.innerHTML = `
            <span class='modal-title new-title'>
                <p>Delete class</p>
                <button class="close-button" onclick="closeModal()">X</button>
            </span>
            <form class='delete-class'>
                <label for="delete">Delete</label>
                <select name="delete" id="delete">
                    <option value="only-one">just this one.</option>
                    <option value="all">all of this class.</option>
                </select>
                <br><br>
                <input type="submit" value="Delete Class">
            </form>
            `;
    }

    // Show the modal
    modalContainer.style.display = 'block';

    const form = modalBox.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        if (mode === 'new') {
            // Get form values
            const selectedCourse = document.getElementById('course').value;
            const selectedType = document.getElementById('type').value;
            const startTime = new Date(document.getElementById('start').value.replace('T',' ')+":00");
            const endTime = new Date(document.getElementById('end').value.replace('T',' ')+":00");
            const repeatInterval = document.getElementById('repeat-interval').value;
            const repeatEnd = new Date(document.getElementById('repeat-end').value + " 23:59:59");
            const checkboxes = document.getElementsByName('repeatDay');
            const checkedCheckboxes = [];
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    checkedCheckboxes.push(checkbox.value);
                }
            });

            // Create a new object with the form values
            const newClassTime = {
                course: selectedCourse,
                type: selectedType,
                start: startTime,
                end: endTime,
                days: checkedCheckboxes,
                interval: repeatInterval,
                repeatEnd: repeatEnd
            };

            // Find the course object in the array
            const selectedCourseObject = courses.find(course => course.name === selectedCourse);

            if (selectedCourseObject) {
                // Update the classTimes property of the selected course
                selectedCourseObject.updateClassTimes(newClassTime);

                // Close the modal after adding the class time
                closeModal();
            } else {
                console.error('Selected course not found.');
            }
        } else if (mode === 'edit') {
            const selectedDelete = document.getElementById('delete').value;
            if (selectedDelete === "only-one") {
                ec.removeEventById(id);
            } else if (selectedDelete === "all") {
                const code = ec.getEventById(id).title.substring(0, ec.getEventById(id).title.indexOf("\n"));
                const selectedCourseObject = courses.find(course => course.name === code);
                for (let classTime of Object.entries(selectedCourseObject.classTimes)) {
                    ec.removeEventById(classTime[0])
                }
                selectedCourseObject.classTimes = {};
            }
            closeModal();
        }

        // for (let event of ec.getEvents()) {
        //     console.log(event)
        // }

        // for (let course of courses) {
        //     for (let time of Object.entries(course.classTimes)) {
        //         console.log(time[1].start.getTime())
        //     }
        // }
    });
}

function closeModal() {
    // Get modal container and hide it
    let modalContainer = document.getElementById('modalContainer');
    modalContainer.style.display = 'none';
}

let idCounter = 0
let courses = [
    new Course("SCH4UP", "#07f032"), 
    new Course("MCR3UP", "#1d42c4"), 
    new Course("ENG3UP", "#fce33d"), 
    new Course("FSF3UP", "#fc433d")];
let ec = new EventCalendar(document.getElementById('ec'), {
    view: 'timeGridWeek',
    allDaySlot: false,
    slotHeight: 36,
    // hiddenDays: [0,6],
    scrollTime: "09:00:00",
    eventDrop: function (info) {
        const selectedCourseObject = courses.find(course => course.name === info.event.title.substring(0, info.event.title.indexOf("\n")));
        selectedCourseObject.classTimes[info.event.id].start = info.event.start;
        selectedCourseObject.classTimes[info.event.id].end = info.event.end;
    },
    eventResize: function (info) {
        const selectedCourseObject = courses.find(course => course.name === info.event.title.substring(0, info.event.title.indexOf("\n")));
        selectedCourseObject.classTimes[info.event.id].start = info.event.start;
        selectedCourseObject.classTimes[info.event.id].end = info.event.end;
    },
    eventClick: function (info) {
        openModal(info.event.start, 'edit', info.event.id);
    },
    dateClick: function (info) {
        openModal(info.date);
    },
    events: []
});