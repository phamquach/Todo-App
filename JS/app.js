import * as quanly from './quanly.js'

const body = document.querySelector('body')
const logout = document.getElementById('logout')


body.style.display = 'none'

logout.addEventListener('click',()=>{
  alert("Bạn Đã Đăng Xuất Thành Công")
  window.localStorage.removeItem('isLoggedIn')
})


/**
 * Function to check if user is logged in
 * @async
 * @function onLoad
 */
window.onload = async function () {
  // Get the login status from localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  if (isLoggedIn !== 'true') {
    // Alert the user to login
    alert('Vui Long Dang Nhap')
    // Redirect to login page
    window.location.href = '/HTML/login.html'
  } else {
    // Show the main page
    body.style.display = 'block'
  }
}

quanly.start()