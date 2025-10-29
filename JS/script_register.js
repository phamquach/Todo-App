const input = document.querySelectorAll("input");
const form = document.querySelector("form");
const body = document.querySelector('body')
const API = 'http://localhost:5678/User'

body.style.display = 'none'


if (window.localStorage.getItem('isLoggedIn') !== 'true') {
  body.style.display = 'block'
} else {
  alert('Vui Long Dang Xuat')
  window.location.href = '/HTML/index.html'
}




// start program
/**
 * Start the program
 * @description Starts the program and waits for the form to be submitted
 */

// Wait for the form to be submitted
function start() {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      // Get the user data from the API
      let User_Api = await getUserByApi();
      // Get the user data from the form
      let User_Data = await getUserByForm();
      // Create the user
      await createUser(User_Api, ...User_Data)

    } catch (error) {
      // Log the error
      console.log(error)
    }
  })
}
start()



/**
 * Get the user data from the API
 * @returns {Promise<object[]>} - A promise that resolves to an array of user data objects
 */
async function getUserByApi() {
  // Get the response from the API
  let response = await fetch(API);

  // Check if the response is ok
  if (!response.ok) {
    throw new Error('Error when fetching the API');
  }

  // Parse the response as json
  let data = await response.json();

  // Return the user data
  return data;
}

// Create user
/**
 * Create a new user in the API
 * @param {array} User_Api - The data from the API
 * @param {array} User_Data - The data from the form
 */
async function createUser(User_Api, ...User_Data) {
  console.log(User_Data)
  try {
    // Check if the username already exists in the API
    await check_user_in_API(User_Api, User_Data[2].value)
    // Create the user object
    let user = {
      Ho: User_Data[0].value,
      Ten: User_Data[1].value,
      Username: User_Data[2].value,
      Password: User_Data[3].value,
      Email: User_Data[5].value,
      PhoneNumber: User_Data[6].value,
      Date: User_Data[7].value,
      MyWork:[]
    }
    // Create the POST request
    let Post = {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" }
    }
    // Send the request and check the response
    await fetch(API, Post).then(response => {
      if (response.ok) {
        alert('Created a User')

      }
    })
  } catch (error) {
    alert(error)
  }
}


// check Username in API
/**
 * Check if the username already exists in the API
 * @param {array} data_Api - The data from the API
 * @param {string} Username - The username to check
 * @returns {Promise<boolean>} - A promise that resolves if the username does not exist, or rejects with an error message
 */
function check_user_in_API(data_Api, Username) {
  return new Promise((resolve, reject) => {
    let checkUser = true;

    for (let user of data_Api) {
      if (user.Username === Username) {
        checkUser = false
        break;
      }
    }

    if (checkUser) resolve(true)
    else reject("User Da Ton Tai Tren He Thong", false)
  })
}


/**
 * Get User By Form
 * @function getUserByForm
 * @description Get user data from form and check if it's valid
 * @returns {Promise<input[]>} - A promise that resolves to an array of input elements if all data is valid, or rejects with an error message
 */
function getUserByForm() {

  return new Promise(async (resolve, reject) => {
    try {
      // Get user data from form
      let userData = await CheckDataForm();
      // Resolve the promise with user data
      resolve(userData)
      return;

    } catch (error) {
      // Log the error
      console.log("Có lỗi xảy ra:", error);
      // Reject the promise with an error message
      reject("No data available")
    }
  });
}

/**
 * Check Data Form
 * @function CheckDataForm
 * @description Check if all data in form is valid
 * @returns {Promise<input[]>} - A promise that resolves to an array of input elements if all data is valid, or rejects with an error message
 */
function CheckDataForm() {
  return new Promise(async (resolve, reject) => {

    let valid = true;

    // Check if all input elements have value
    for (let key = 0; key < input.length; key++) {
      if (input[key].value === "") {
        valid = false;
      }
    }

    if (valid) {
      try {
        // Check if the password is valid
        valid = await CheckPass(input[3].value);
        if (valid) {
          // If all data is valid, resolve with the input elements array
          resolve(input);
        }
      } catch (err) {
        // If there is an error, log it and reject with an error message
        console.log(err);
        reject('There is data that has not been imported');
      }
    }
    else {
      // If not all data is valid, alert the user and reject with an error message
      alert("Please enter complete information");
      reject('There is data that has not been imported');
    }
  })
}

/**
 * Check Pass
 * @function CheckPass
 * @description Check if the password has at least 1 number, 1 special character, and 8 characters
 * @param {string} Password - The password to check
 * @returns {Promise<boolean|Error>} - A promise that resolves to true if the password is valid, or rejects with false if it's not
 */
function CheckPass(Password) {
  return new Promise((resolve, reject) => {

    let sLitsPassword = Password.split("");

    const DkPass = {
      /**
       * Array of numbers
       * @constant
       * @type {string[]}
       */
      check_pass_num: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      /**
       * Array of special characters
       * @constant
       * @type {string[]}
       */
      check_pass_ktdb: ["!", "~", "/", ")", "[", "*", "^", "$", "&", "@"]
    };

    let check_num = false
    let check_ktdb = false
    let check_pass = true
    let check_length = sLitsPassword.length >= 8

    if (input[3].value === input[4].value) {
      check_pass = true
    } else {
      check_pass = false
    }

    sLitsPassword.forEach((item) => {
      if (DkPass.check_pass_num.includes(item)) check_num = true
      return
    });

    sLitsPassword.forEach(item => {
      if (DkPass.check_pass_ktdb.includes(item)) check_ktdb = true
      return
    })

    let valid = check_num && check_ktdb && check_pass && check_length

    if (valid) resolve(true)
    else {
      if (!check_num || !check_ktdb) alert('Password must contain numbers and special characters')
      else if (!check_length) alert("Password greater than or equal to 8 characters")
      else if (!check_pass) alert("Passwords are not the same")
      reject(false)
    }

  })
}

/**
 * Delete old data
 * @function dOldData
 * @description Delete all values of all input elements
 * @param {void} 
 * @returns {void}
 */
function dOldData() {
  // Delete all values of all input elements
  input.forEach(element => {
    element.value = ""
  })
}

