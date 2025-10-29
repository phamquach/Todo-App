const form = document.querySelector("#login")
const input = document.getElementsByTagName('input')
const API = 'http://localhost:5678/User'
const body = document.querySelector('body')

body.style.display = 'none'



if (window.localStorage.getItem('isLoggedIn') !== 'true') {
    body.style.display = 'block'
} else {
    alert('Vui Long Dang Xuat')
    window.location.href = '/HTML/index.html'
}


/**
 * Start the login process
 * @async
 * @function start
 * @description Listens for form submission and handles user login
 */
async function start() {
    // Add event listener for form submission
    form.addEventListener('submit', async (event) => {
        // Prevent default form submission behavior
        event.preventDefault();

        try {
            // Check user credentials
            await check_User();

            // Handle successful login
            handleLogin();

            // Notify user to begin work
            alert("Nhấp Ok Để Bắt Đầu Công Việc");

        } catch (error) {
            // Alert user of any errors
            alert(error);
        }
    });
}
start()


/**
 * Handle the login
 * @function handleLogin
 * @description Handle the login, set the isLoggedIn to true and redirect to the index.html
 */
function handleLogin() {
    // Set the isLoggedIn to true
    localStorage.setItem('isLoggedIn', true);

    // Redirect to the index.html
    window.location.href = "/HTML/index.html";
}

/**
 * Get the user data from the API
 * @async
 * @function get_User_Api
 * @description Get the user data from the API
 * @returns {Promise<object[]>} - A promise that resolves to the user data object
 */
async function get_User_Api() {
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


// Check User Form
/**
 * Check if the user data in the form is valid
 * @function check_Data_Form
 * @description Check if the user data in the form is valid
 * @returns {Promise<input[]>} - A promise that resolves to the input elements array if all data is valid, or rejects with an error message
 */
function check_Data_Form() {
    return new Promise(async (resolve, reject) => {

        let valid = true;

        // Check if all input elements have value
        for (let key = 0; key < input.length; key++) {
            if (input[key].value === "") {
                valid = false;
            }
        }

        if (valid) {
            // Resolve the promise with the input elements array
            resolve(input)
        }
        else {
            // If not all data is valid, alert the user and reject with an error message
            reject('There is data that has not been imported');
        }

        // Delete all values of all input elements
        dOldData()
    })
}


// Check User By Form with User By Api
/**
 * Check if the user data from the form matches the user data in the API
 * @async
 * @function check_User
 * @description Check if the user data from the form matches the user data in the API
 * @returns {Promise<boolean>} - A promise that resolves to true if the user data matches, or rejects with an error message
 */
async function check_User() {
    let Data_Api = await get_User_Api()
    let Data_Form = await check_Data_Form()
    return new Promise((resolve, reject) => {
        let boolean = false
        // Loop through the user data from the API
        Data_Api.forEach(element => {
            // Check if the username and password from the form match the username and password from the API
            if (element.Username === Data_Form[0].value && element.Password === Data_Form[1].value) {
                // If the username and password match, set the id in the local storage and set the boolean to true
                localStorage.setItem('id', element.id)
                boolean = true
                // Stop the loop
                return;
            }
        });

        // If the boolean is true, resolve the promise with true
        if (boolean) resolve(boolean)
        // If the boolean is false, reject the promise with an error message
        else reject("Tên Đăng Nhập Hoặc Mật Khẩu Sai")
    })
}

/**
 * Clear input fields
 * @function dOldData
 * @description Clears the value of each input element on the page
 * @returns {void}
 */
function dOldData() {
    // Iterate over each input element
    input.forEach(element => {
        // Clear the value of the current input element
        element.value = "";
    });
}
