let logout = document.getElementById("logout");
let Playlist_btn = document.getElementById("Playlist_btn");

let authToken = localStorage.getItem("authToken");

console.log(authToken);
if (authToken) {
  let logout = document.getElementById("logout");
  let Playlist_btn = document.getElementById("Playlist_btn");
  console.log(logout);
  console.log(Playlist_btn);

  Playlist_btn.style.display = "block";
  logout.style.display = "block";


  document.getElementById("Play").style.color = "white";
  document.getElementById("log").style.color = "white";
  document.getElementById("login").style.display = "none";
  document.getElementById("signup").style.display = "none";
}
function logout_data() {
  console.log("hi");
  localStorage.removeItem("authToken");
  window.location.reload = "home.html";
}

function addSongs() {
  console.log("hi");
  window.location.reload = "addPlaylist.html";
}


