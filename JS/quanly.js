const table = document.querySelector("table");
const input = document.querySelector('input');
const button = document.querySelector('#conplete')

let stt = 0;
const API = 'http://localhost:5678/User/' + localStorage.getItem('id')

// start
export async function start() {
  await show()
}

/**
 * Show all tasks in table
 * @async
 * @function show
 */
async function show() {
  // Get the list of tasks
  let m = await list_Task()
  console.log(m)

  // Map through the list of tasks and add each one to the table
  m.map(item => {
    stt++
    const insertRow = table.insertRow()
    insertRow.innerHTML = `<td>${stt}</td>
    <td>${item}</td>
    <td><input type="checkbox" class="checkWork" onclick="check(${stt})" id="${stt}"></td>
    <td><button onclick="dele(${stt - 1})">Delete</button></td>`
  })
}

// List Taks
/**
 * Get the list of tasks
 * @async
 * @function list_Task
 * @returns {Promise<string[]>} - A promise that resolves to an array of task strings
 */
async function list_Task() {
  // Get the user data from the API
  let data = (await get_Data_Api()).MyWork
  // Return the array of tasks
  return data
}

// Delete
/**
 * Delete a task from the list
 * @async
 * @function dele
 * @param {number} [index=-1] - The index of the task to delete. If not provided, delete all tasks
 */
window.dele = async function (index = -1) {

  // Get the array of tasks
  let array = (await get_Data_Api()).MyWork

  // If the index is provided, delete the task at that index
  if (index !== -1) array.splice(index, 1)
  // If the index is not provided, delete all tasks
  else {
    // If there are no tasks, alert the user and return
    if (array.length === 0) {
      alert("There are no quests to clear")
      return;
    }
    // Delete all tasks
    array = []
  }

  // Create the PATCH request
  const Patch = {
    method: "PATCH",
    body: JSON.stringify({ MyWork: array })
  }

  // Send the request and check the response
  let response = await fetch(API, Patch)
  if (!response.ok) console.log('Loi')
}


/**
 * Add a new task to the user's work list
 * @async
 * @function add
 */
window.add = async function () {
  // Retrieve the current list of tasks from the API
  let array = (await get_Data_Api()).MyWork

  // Check if the input field is not empty
  if (input.value !== "") {
    // Add the new task from the input field to the task list
    array.push(input.value)

    // Create the PATCH request to update the task list
    const Patch = {
      method: "PATCH",
      body: JSON.stringify({ MyWork: array })
    }

    // Send the PATCH request to the API
    let response = await fetch(API, Patch)

    // Log an error message if the request fails
    if (!response.ok) console.log('Error while updating tasks')
  } else {
    // Alert the user if the input field is empty
    alert("No input data")
  }
}


/**
 * Toggle the completion state of tasks in the table
 * @param {number} [id=-1] - The ID of the task to toggle. If not provided, toggles all tasks.
 */
window.check = function (id = -1) {
  // Get all table rows
  let ChangeRow = table.querySelectorAll('tr');

  if (id !== -1) {

    // Toggle the completion state for a specific task
    let check = document.getElementById(id);
    if (check.checked) {
      ChangeRow[id].style.filter = "blur(2px)";
    } else {
      ChangeRow[id].style.filter = "blur(0px)";
    }

  } else if (ChangeRow.length > 1) {

    // Toggle the completion state for all tasks
    if (button.textContent === 'Complete It All') {
      for (let i = 1; i < ChangeRow.length; i++) {
        let check = document.getElementById(i);
        check.checked = true;
        ChangeRow[i].style.filter = "blur(2px)";
      }
      button.textContent = "Unfinished";

    } else {
      for (let i = 1; i < ChangeRow.length; i++) {
        let check = document.getElementById(i);
        check.checked = false;
        ChangeRow[i].style.filter = "blur(0px)";
      }
      button.textContent = "Complete It All";
    }

  } else {
    // Alert the user if there are no tasks
    alert("There are no quests in the quest list");
  }
  
}

/**
 * Get the user data from the API
 * @async
 * @function get_Data_Api
 * @returns {Promise<object>} - A promise that resolves to the user data object
 */
async function get_Data_Api() {
  // Send a GET request to the API to retrieve the user data
  const response = await fetch(API)

  // Check if the request failed
  if (!response.ok) {
    // Throw an error if the request failed
    throw new Error('Error when fetching the API')
  }

  // Return the user data
  return response.json()
}

