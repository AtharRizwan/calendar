const calendarDates = document.getElementById("calendarDates");
const weekDates = document.getElementById("weekDates");
const currentMonth = document.getElementById("currentMonth");
const toggleView = document.getElementById("toggleView");
const eventForm = document.getElementById("eventForm");
const eventNameInput = document.getElementById("eventName");
const saveEventButton = document.getElementById("saveEvent");
const cancelEventButton = document.getElementById("cancelEvent");
const deleteEventButton = document.getElementById("deleteEvent");
const eventDetails = document.getElementById("eventDetails");

let date = new Date();
let selectedCell = null;
let events = {};

function renderMonthView() {
    calendarDates.innerHTML = "";
    currentMonth.textContent = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });

    let firstDayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let daysInPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

    // Render previous month's days (inactive)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const prevDay = document.createElement("div");
        prevDay.classList.add("date-cell", "inactive");
        prevDay.textContent = daysInPrevMonth - i;
        calendarDates.appendChild(prevDay);
    }

    // Render current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement("div");
        day.classList.add("date-cell");
        day.textContent = i;

        if (events[`${date.getFullYear()}-${date.getMonth() + 1}-${i}`]) {
            const eventLabel = document.createElement("div");
            eventLabel.classList.add("event");
            eventLabel.textContent = events[`${date.getFullYear()}-${date.getMonth() + 1}-${i}`];
            day.appendChild(eventLabel);
        }

        day.addEventListener("click", function () {
            if (selectedCell) {
                selectedCell.style.backgroundColor = "white";
            }
            selectedCell = day;
            selectedCell.style.backgroundColor = "lightblue";
            eventForm.classList.remove("hidden");
            const eventLabel = selectedCell.querySelector(".event");
            if (eventLabel) {
                eventDetails.classList.remove("hidden");
                eventDetails.innerHTML = eventLabel.textContent;
                deleteEventButton.classList.remove("hidden"); 
            } else {
                eventDetails.innerHTML = "";
                deleteEventButton.classList.add("hidden");
                eventDetails.classList.add("hidden");
            }
        });
        
        calendarDates.appendChild(day);
    }

    // Fill in the remaining days of the next month
    let totalCells = firstDayIndex + daysInMonth;
    for (let y = 1; y <= (42 - totalCells); y++) {
        const nextDay = document.createElement("div");
        nextDay.classList.add("date-cell", "inactive");
        nextDay.textContent = y;
        calendarDates.appendChild(nextDay);
    }
}

function renderWeekView() {
    weekDates.innerHTML = "";
    currentMonth.textContent = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    let startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    
    for (let i = 0; i < 7; i++) {
        const day = document.createElement("div");
        day.classList.add("date-cell");
        let currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        day.textContent = currentDate.getDate();

        if (events[`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`]) {
            const eventLabel = document.createElement("div");
            eventLabel.classList.add("event");
            eventLabel.textContent = events[`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`];
            day.appendChild(eventLabel);
        }

        day.addEventListener("click", function () {
            if (selectedCell) {
                selectedCell.style.backgroundColor = "white";
            }
            selectedCell = day;
            selectedCell.style.backgroundColor = "lightblue";
            eventForm.classList.remove("hidden");
            const eventLabel = selectedCell.querySelector(".event");
            if (eventLabel) {
                eventDetails.classList.remove("hidden");
                eventDetails.innerHTML = eventLabel.textContent;
                deleteEventButton.classList.remove("hidden"); 
            } else {
                eventDetails.innerHTML = "";
                deleteEventButton.classList.add("hidden");
                eventDetails.classList.add("hidden");
            }
        });
        
        weekDates.appendChild(day);
    }
}

toggleView.addEventListener("click", function() {
    selectedCell = null;
    eventForm.classList.add("hidden");
    const monthView = document.getElementById("monthView");
    const weekView = document.getElementById("weekView");
    
    if (monthView.classList.contains("hidden")) {
        weekView.classList.add("hidden");
        monthView.classList.remove("hidden");
        toggleView.textContent = "Switch to Weekly View";
        renderMonthView();
    } else {
        monthView.classList.add("hidden");
        weekView.classList.remove("hidden");
        toggleView.textContent = "Switch to Monthly View";
        renderWeekView();
    }
});

saveEventButton.addEventListener("click", function() {
    if (selectedCell && eventNameInput.value.trim()) {
        let eventDate = `${date.getFullYear()}-${date.getMonth() + 1}-${selectedCell.textContent.trim()}`;

        const checkEvent = selectedCell.querySelector(".event");
        if (checkEvent) {
            const existingEventLabel = selectedCell.querySelector(".event");
            if (existingEventLabel) {
                selectedCell.removeChild(existingEventLabel);
            }
        }
        
        events[eventDate] = eventNameInput.value.trim();

        const eventLabel = document.createElement("div");
        eventLabel.classList.add("event");
        eventLabel.textContent = eventNameInput.value.trim();
        selectedCell.appendChild(eventLabel);

        eventNameInput.value = "";
        eventForm.classList.add("hidden");
        selectedCell.style.backgroundColor = "white";
        selectedCell = null;
    }
});

cancelEventButton.addEventListener("click", function() {
    eventForm.classList.add("hidden");
    if (selectedCell) {
        selectedCell.style.backgroundColor = "white";
        selectedCell = null;
    }
});

deleteEventButton.addEventListener("click", function() {
    if (selectedCell) {
        let eventDate = `${date.getFullYear()}-${date.getMonth() + 1}-${selectedCell.textContent.trim()}`;
        delete events[eventDate];            
        const eventLabel = selectedCell.querySelector(".event");
        if (eventLabel) {
            selectedCell.removeChild(eventLabel);
        }
        selectedCell.style.backgroundColor = "white";
        selectedCell = null;
        eventForm.classList.add("hidden");
    }
});

document.getElementById("prevMonth").addEventListener("click", function() {
    selectedCell = null;
    eventForm.classList.add("hidden");
    date.setMonth(date.getMonth() - 1);
    renderMonthView();
});

document.getElementById("nextMonth").addEventListener("click", function() {
    selectedCell = null;
    eventForm.classList.add("hidden");
    date.setMonth(date.getMonth() + 1);
    renderMonthView();
});

document.getElementById("prevWeek").addEventListener("click", function() {
    selectedCell = null;
    eventForm.classList.add("hidden");
    date.setDate(date.getDate() - 7);
    renderWeekView();
});

document.getElementById("nextWeek").addEventListener("click", function() {
    selectedCell = null;
    eventForm.classList.add("hidden");
    date.setDate(date.getDate() + 7);
    renderWeekView();
});

renderMonthView();
