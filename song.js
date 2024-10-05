const style = document.createElement('style');
style.textContent = `
  .add-to-playlist {
    
    background-color: #ff4757; /* Orange color */
    color: white;
    border: none;
    padding: 10px 15px;
    margin-bottom: 10px;
    margin-right:10px;
    border-radius: 5px;
    cursor: pointer;
    position: relative;  /* Relative within its song card */
    display: inline-block; /* Inline block for better button shape */
    font-size: 14px;
    // width: 100px;
    height: 40px;
    transition: background-color 0.3s ease; /* Add hover effect */

  }

  .add-to-playlist:hover {
    background-color: #ff6b81; /* Darker orange on hover */
  }
`;
document.head.appendChild(style);

var songs = [];
// var authToken = localStorage.getItem("authToken") || null;

// Load songs from song.json and handle errors
async function loadSongs() {
  try {
    const response = await fetch("song.json");
    if (!response.ok) throw new Error("Failed to fetch songs");
    songs = await response.json();
    start();
  } catch (error) {
    console.error('Error loading songs:', error);
    alert('Unable to load songs, please try again later.');
  }
}

// Function to render the songs
function start() {
  let songContainer = document.getElementById("songs");
  songContainer.innerHTML = "";

  if (songs.length === 0) {
    songContainer.innerHTML = '<p>No songs available.</p>';
    return;
  }

  // Loop through songs and dynamically create HTML structure
  songs.forEach((elem, index) => {
    console.log("Song ID: ", elem.id); // Debug line
    
    // Conditionally render the "Add To Playlist" button if user is logged in
    const addToPlaylistButton = authToken
      ? `<button class="add-to-playlist" data-id="${elem.id}">Add To PlayList</button>`
      : ''; // No button if user isn't logged in

    const songCard = `
      <div class="song-card">
        <p>${elem.title}</p>
        <p>${elem.artist}</p>
        <img src="${elem.artwork}" alt="Artwork">
        <br>
        ${addToPlaylistButton}
        <i class="fa fa-play" aria-hidden="true" style="font-size: xx-large; padding-top: 10%; cursor: pointer; color:white;" onclick="popup(${index})"></i>
      </div>`;
    
    songContainer.innerHTML += songCard;
  });

  // Attach event listeners to each "Add to Playlist" button if user is logged in
  if (authToken) {
    document.querySelectorAll('.add-to-playlist').forEach(button => {
      button.addEventListener('click', (e) => {
        console.log("Add to Playlist button clicked!"); // Debug line
        e.stopPropagation(); // Prevents playing the song
        const songId = e.target.getAttribute('data-id');
        console.log("Song ID to add:", songId); // Debug line
        
        // Check if songId is valid
        if (!songId) {
          console.error("Song ID is missing");
          alert("Error: Song ID is missing.");
          return;
        }

        // Find the song to add
        const songToAdd = songs.find(s => s.id === songId); // Compare as strings
        console.log("Song to add:", songToAdd); // Debug line
        
        // Check if songToAdd is found
        if (!songToAdd) {
          console.error(`Song with ID ${songId} not found in songs array.`);
          alert("Error: Song not found.");
          return;
        }
        
        addToPlaylist(songToAdd);
      });
    });
  }
}

// Popup to play song
function popup(elemIndex) {
  const pop = document.getElementById("pop");
  const song = songs[elemIndex];
  pop.style.display = "block";
  pop.innerHTML = `
    <div id="content">
      <p>${song.title} by ${song.artist}</p>
      <img src="${song.artwork}" alt="Artwork">
      <br>
      <audio controls class="audio_" id="myaudio">
        <source src="${song.url}" type="audio/mpeg">
        <source src="${song.url}" type="audio/mp3">
        Your browser does not support the audio element.
      </audio>
      <br>
      <button onclick="previous(${elemIndex})">Prev</button>
      <button onclick="next(${elemIndex})">Next</button>
      <br>
      <i class="fa fa-close" style="font-size:48px;color:red; cursor:pointer" onclick="pop_close()"></i>
    </div>`;

  if (!authToken) {
    restrictPlayback();
  }
}

// Restrict audio playback for non-authenticated users
function restrictPlayback() {
  const audio = document.getElementById("myaudio");
  audio.onloadedmetadata = function () {
    const duration = audio.duration;
    const limit = (duration * 10) / 100;
    audio.ontimeupdate = function () {
      if (audio.currentTime >= limit) {
        audio.pause();
        if (confirm("You cannot play more than 10%. Do you want to login?")) {
          window.location.href = "login.html";
        }
      }
    };
  };
}

function pop_close() {
  const pop = document.getElementById("pop");
  pop.style.display = "none";
}

function previous(elemIndex) {
  if (elemIndex === 0) elemIndex = songs.length - 1;
  else elemIndex--;
  popup(elemIndex);
}

function next(elemIndex) {
  if (elemIndex === songs.length - 1) elemIndex = 0;
  else elemIndex++;
  popup(elemIndex);
}

function addToPlaylist(song) {
  if (!song) {
    alert("Error: Song not found.");
    return;
  }

  const userPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
  
  // Ensure both IDs are compared as strings
  if (!userPlaylist.some(s => s.id === song.id.toString())) {
    userPlaylist.push(song);
    localStorage.setItem('playlist', JSON.stringify(userPlaylist));
    alert(`${song.title} has been added to your playlist.`);
  } else {
    alert(`${song.title} is already in your playlist.`);
  }
}

// Call loadSongs to initialize
loadSongs();
