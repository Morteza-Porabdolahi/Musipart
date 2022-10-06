const playBtn = document.querySelector('.control:nth-child(2)');
const audioElem = document.querySelector('audio');

playBtn.addEventListener('click', playOrPauseAudio);
window.addEventListener('load', getSingleMuaic);

let isPlaying = false;

/*
* gets the single music using search parameters
* @function getSingleMuaic
*/
async function getSingleMuaic() {
  try {
    // get the music object from it's id
    const id = new URLSearchParams(location.search).get('id');

    const response = await fetch(`https://haji-api.ir/music?q=info&t=${id}`);
    const data = await response.json();

    if(!data.hasOwnProperty('id')){
      location.href = "/pages/404.html"
    }else{
      // set Document Title as song name
      document.title = `Musipart || ${data.title}`;

      handleData(data);
    }
  } catch (e) {
    if (e) {
      hidePreloader();

      showAlert('error', 'Something went Wrong !');
      setTimeout(hideAlert, 1000);
    }
  }
}

/*
* put the song informations such as lyrics,title,... into dom
* @function getSingleMuaic
* @param {object} song - the song Object
*/
function handleData(song) {
  const musicImage = document.querySelector('.description__image > img');
  const musicTitle = document.querySelector('.texts__titles > h3');
  const musicArtists = document.querySelector('.texts__titles > p');
  const lyricsContainer = document.querySelector('.description__lyrics > p');

  musicImage.alt = song.title;
  musicImage.src = song.image.cover.url;

  musicTitle.textContent = song.title;
  musicArtists.textContent = song.artists.map((artist) => artist.fullName);

  lyricsContainer.textContent = song.lyrics ?
    song.lyrics :
    'No lyrics Found...!';

  audioElem.src = song.audio.medium.url;

  hidePreloader();
}

/*
* pauses the playing music
* @function pauseMusic
*/
function pauseMusic() {
  isPlaying = false;
  playBtn.firstElementChild.src = '/assets/icons/play-mini-line.svg';

  audioElem.pause();
}

/*
* plays the music
* @function playMusic
*/
function playMusic() {
  isPlaying = true;
  playBtn.firstElementChild.src = '/assets/icons/pause-mini-line.svg';

  audioElem.play();
}

/*
* if the music is playing pause it and else play it
* @function playOrPauseAudio
*/
function playOrPauseAudio() {
  if (!isPlaying) {
    playMusic();
  } else {
    pauseMusic();
  }
}
