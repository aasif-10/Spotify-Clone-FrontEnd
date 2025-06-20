let songs;
let currentFolder = "";

// Fetch songs
async function getSongs(folder) {
  let a = await fetch(`http://127.0.0.1:5500/Playlists/${folder}/`);
  currentFolder = folder;
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`Playlists/${folder}/`)[1]);
    }
  }
  //   Listing all songs
  let songlist = document
    .querySelector(".song-listing")
    .getElementsByTagName("ul")[0];

  songlist.innerHTML = "";

  // New code
  for (let song of songs) {
    let songName = song.replaceAll("%20", " ").replace(".mp3", "");
    let [title, artist] = songName.split("-");
    let coverPath = `/Playlists/${folder}/${title}-${artist}/cover.jpg`;

    songlist.innerHTML += `
      <li>
        <div class="song-card-container">
          <div class="song-list-card">
            <div class="card-list-img">
              <img src="${coverPath}" 
                    
                   alt="${title}" class="song-img">
              <div class="play-button"><i class="fa-solid fa-play"></i></div>
            </div>
            <div class="song-info">
              <p class="song-title">${title}</p>
              <p class="song-artist">${artist}</p>
            </div>
          </div>
        </div>
      </li>`;
  }

  // for (let song of songs) {
  //   songlist.innerHTML =
  //     songlist.innerHTML +
  //     ` <li>
  //           <div class="song-card-container">
  //               <div class="song-list-card">
  //                   <div class="card-list-img">
  //                       <img src="https://i.scdn.co/image/ab67616d0000b27379dd2165f2180c79713bfe4a"
  //                        alt="" class="song-img">
  //                       <div class="play-button"><i class="fa-solid fa-play"></i>
  //                       </div>
  //                   </div>
  //                   <div class="song-info">
  //                       <p class="song-title">${
  //                         song
  //                           .replaceAll("%20", " ")
  //                           .replaceAll(".mp3", "")
  //                           .split("-")[0]
  //                       }</p>
  //                       <p class="song-artist">${
  //                         song
  //                           .replaceAll("%20", " ")
  //                           .replaceAll(".mp3", "")
  //                           .split("-")[1]
  //                       }</p>
  //                   </div>
  //               </div>
  //           </div>
  //       </li>`;
  // }

  // To play songs from list
  let lis = Array.from(
    document.querySelector(".song-listing").getElementsByTagName("li")
  );

  lis.forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".song-info").getElementsByTagName("p"), 0);
    }); // Event listener
  }); //for each loop
}

// Covert seconds to minutes

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

// Playing the track

let currentSong = new Audio();
let currentSongName = null;

let playMusic = (track, check) => {
  let songfile;
  if (check == 0) {
    songfile =
      `Playlists/${currentFolder}/` +
      track[0].innerHTML +
      "-" +
      track[1].innerHTML +
      ".mp3";
  } else {
    songfile =
      `Playlists/${currentFolder}/` + track[0] + "-" + track[1] + ".mp3";
  }

  let songControlBtnPlay = Array.from(
    document.querySelector(".song-controls").getElementsByClassName("play")
  )[0];

  if (currentSongName == songfile) {
    if (currentSong.paused) {
      currentSong.play();
      songControlBtnPlay.classList.remove("fa-circle-play");
      songControlBtnPlay.classList.add("fa-circle-pause");
    } else {
      currentSong.pause();
      songControlBtnPlay.classList.remove("fa-circle-pause");
      songControlBtnPlay.classList.add("fa-circle-play");
    }
  } else {
    currentSong.src = songfile;
    currentSong.play();
    currentSongName = songfile;
    songControlBtnPlay.classList.remove("fa-circle-play");
    songControlBtnPlay.classList.add("fa-circle-pause");
  }

  let songName = document
    .querySelector(".playbar-section")
    .getElementsByClassName("song-name")[0];

  // coverPath = `/Playlists/${folder}/${title}-${artist}/cover.jpg`;
  let cover = currentSong.src
    .split("/Playlists/")[1]
    .replaceAll("%20", " ")
    .replaceAll(".mp3", "");

  if (check == 0) {
    songName.innerHTML = `<div class="song-img"><img src="/Playlists/${cover}/cover.jpg" alt=""/></div> <div><p class="song-name-1">${track[0].innerHTML}</p>
<p class="song-artist-1">${track[1].innerHTML}</p></div>`;
  } else {
    songName.innerHTML = `<div class="song-img"><img src="/Playlists/${cover}/cover.jpg" alt=""/></div> <div><p class="song-name-1">${track[0]}</p> <p class="song-artist-1">${track[1]}</p></div>`;
  }
  let songDuration = document
    .querySelector(".playbar-section")
    .getElementsByClassName("song-duration")[0];

  songDuration.innerHTML = "00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/Playlists/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let container;
  let array = Array.from(div.getElementsByTagName("a"));

  for (arr of array) {
    if (arr.href.includes("/Playlists/")) {
      let folder = arr.href.split("/Playlists/")[1];

      let a = await fetch(
        `http://127.0.0.1:5500/Playlists/${folder}/info.json`
      );
      let response = await a.json();
      if (folder.startsWith("playlist-")) {
        container = document.querySelector(".card-container");
      } else if (folder.startsWith("second-playlist-")) {
        container = document.querySelector(".card-container-1");
      } else if (folder.startsWith("third-playlist-")) {
        container = document.querySelector(".card-container-2");
      }

      container.innerHTML += `<div data-folder="${folder}" class="card">
          <div class="image-section">
            <img src="/Playlists/${folder}/cover.jpg"
                                alt="playlist-img">

                            
            <div class="overlay-play-btn"><i class="fa-solid fa-play"></i></div>
            </div>
              <div class="card-title"><h2>${response.title}</h2>
              <p>${response.description}</p></div>
            </div>`;
    }
  }

  // Event listener to show songs in a card

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      await getSongs(`${item.currentTarget.dataset.folder}`);
    });
  });
}

// Main function

async function main() {
  // Getting all songs
  await getSongs("playlist-1");

  displayAlbums();

  // Add event listener to play , back , next

  let songControlBtnPlay = Array.from(
    document.querySelector(".song-controls").getElementsByClassName("play")
  )[0];

  songControlBtnPlay.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      songControlBtnPlay.classList.remove("fa-circle-play");
      songControlBtnPlay.classList.add("fa-circle-pause");
    } else {
      currentSong.pause();
      songControlBtnPlay.classList.remove("fa-circle-pause");
      songControlBtnPlay.classList.add("fa-circle-play");
    }
  }); //Event listener

  // Listen for timeupdate Event

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(
      ".song-duration-1"
    ).innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}`;
    document.querySelector(
      ".song-duration"
    ).innerHTML = `${secondsToMinutesSeconds(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
    document.querySelector(".top-seek-bar").style.width =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Event listener for seek bar

  document.querySelector(".seek-bar").addEventListener("click", (e) => {
    const seekBar = document.querySelector(".seek-bar");
    const rect = seekBar.getBoundingClientRect();

    let clickX = e.clientX - rect.left; // Get exact position of click
    let percent = (clickX / rect.width) * 100;

    // Clamp value to 0–100 just in case
    percent = Math.max(0, Math.min(percent, 100));
    document.querySelector(".circle").style.left = percent + "%";
    document.querySelector(".top-seek-bar").style.width = percent + "%";

    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Event listener for hamburger and clost btn
  document.querySelector(".hambur").addEventListener("click", () => {
    document.querySelector(".left-container").style.left = 0;
  });

  document.querySelector(".close-btn").addEventListener("click", () => {
    document.querySelector(".left-container").style.left = "-120%";
  });

  //Even listener for prev
  back.addEventListener("click", () => {
    let src = currentSong.src.split(`Playlists/${currentFolder}/`)[1];
    let index = songs.indexOf(src);
    let track = songs[index - 1]
      .replaceAll("%20", " ")
      .replaceAll(".mp3", "")
      .split("-");
    if (index - 1 >= 0) {
      playMusic(track, 1);
    }
  });

  //Even listener for next
  next.addEventListener("click", () => {
    let src = currentSong.src.split(`Playlists/${currentFolder}/`)[1];
    let index = songs.indexOf(src);
    let track = songs[index + 1]
      .replaceAll("%20", " ")
      .replaceAll(".mp3", "")
      .split("-");
    if (index + 1 < songs.length) {
      playMusic(track, 1);
    }
  });

  // Event listener for volume

  // Volume Slider (range input)
  document.querySelector(".range input").addEventListener("input", (e) => {
    const volumeValue = Number(e.target.value) / 100;
    currentSong.volume = volumeValue;

    const volumeIcon = document.querySelector(".volume > i");
    if (volumeValue === 0) {
      volumeIcon.classList.remove("fa-volume-up", "vol");
      volumeIcon.classList.add("fa-volume-xmark");
    } else {
      volumeIcon.classList.remove("fa-volume-xmark");
      volumeIcon.classList.add("fa-volume-up", "vol");
    }
  });

  // Mute functionality
  document.querySelector(".volume>i").addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-volume-up")) {
      e.target.classList.remove("fa", "fa-volume-up", "vol");
      e.target.classList.add("fa-solid", "fa-volume-xmark");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.classList.remove("fa-solid", "fa-volume-xmark");
      e.target.classList.add("fa", "fa-volume-up", "vol");
      currentSong.volume = 0.9;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

main();
