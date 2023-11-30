// Constants for the cohort and API endpoint
const COHORT = "2310-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// State object to store events and array
const state = {
  events: [],
};

// List where events will be displayed
const eventList = document.querySelector("#events");

// Form to add new events
const addEventForm = document.querySelector("#addEvent");

// Event listener
addEventForm.addEventListener("submit", addEvent);

// Function to initially render events on the page
async function render() {
  await getEvents();
  renderEvents();
}
render();

// Fetches events from the API and updates the state
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

// Renders the events in the UI
async function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    // Create an HTML representation for each event
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${event.name}</h2>
      <p>${event.description}</p>
      <p>Date: ${new Date(event.date).toDateString()}</p>
      <p>Location: ${event.location}</p>
      <button class="deleteBtn" data-id="${event.id}">Delete</button>
    `;

    const deleteButton = li.querySelector(".deleteBtn");
    deleteButton.addEventListener("click", (event) => {
      const eventId = event.target.dataset.id;
      deleteEvent(eventId);
    });

    // Add event listeners for update form (similar to previous code)

    return li;
  });

  eventList.replaceChildren(...eventCards);
}

// Deletes an event based on its ID
async function deleteEvent(eventId) {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }

    render(); // Re-renders the event list after deletion
  } catch (error) {
    console.error(error);
  }
}

// // Updates an existing event using its ID and updated information
// async function updateEvent(eventId, updatedName, updatedDescription, updatedDate, updatedLocation) {
//   try {
//     const response = await fetch(`${API_URL}/${eventId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: updatedName,
//         description: updatedDescription,
//         date: updatedDate,
//         location: updatedLocation,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update event");
//     }

//     render(); // Re-renders the event list after update
//   } catch (error) {
//     console.error(error);
//   }
// }

// Adds a new event based on the form data
async function addEvent(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: addEventForm.date.value + ":00.000Z",
        location: addEventForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
