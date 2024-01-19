//curentsongplaying-
let currentsong = new Audio();
let songs;
let currfolder;

//for displying a time of a song (00:01/03:08)-

function secondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // Display songs on below the library section
  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songul.innerHTML = " ";

  for (const song of songs) {
    songul.innerHTML =
      songul.innerHTML +
      `<li>
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          
        </div>
        <div class="playnow">
          <span>Playnow</span>
          <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>`;
  }

  // Attach an event listener to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}


//playmusic function for playiong current song-

const playmusic = (track, pause = false) => {
  currentsong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentsong.play();
    play.src = "img/pause.svg";
  }
  currentsong.play();

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  // Get the list of all songs
  await getsongs("songs/ncs");

  playmusic(songs[0], true);

  //Attach event listener for previous, play and button-

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "img/play.svg";
    }
  });

  //listenfor time update event-
  currentsong.addEventListener("timeupdate", () => {
    //for displying time of a song
    document.querySelector(
      ".songtime"
    ).innerHTML = `${secondsToMinutesAndSeconds(
      currentsong.currentTime
    )} / ${secondsToMinutesAndSeconds(currentsong.duration)}`;

    //forseekbar-cirlce-
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
  //add event listener for a movement seekbar cirlce--

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    // when circle move simultanously move time it shows time--
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  //Add eventlistner for hamburger--

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Add eventlistner for close--

  document.querySelector(".close-btn").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add eventlistner for previous btn--

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });

  // Add eventlistner for next btn--
  next.addEventListener("click", () => {
    currentsong.pause();

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  //Add eventlistner for range input for volume--
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/100");
      currentsong.volume = parseInt(e.target.value) / 100;

      if (currentsong.volume>0){
        document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
      }
    });

  //load the playlist whenever we clicked the card--

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playmusic(songs[0])
    });
  });

  //Add event listener for mute the track--

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentsong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentsong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

main();
