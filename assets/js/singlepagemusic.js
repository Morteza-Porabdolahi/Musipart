const playBtn = document.querySelector('.control:nth-child(2)');
const audioElem = document.querySelector('audio');

playBtn.addEventListener('click',playOrPauseAudio);
window.addEventListener('load',getSingleMuaic);

let isPlaying = false;

async function getSingleMuaic() {
  try{
    // get the music object from it's id
    const id = new URLSearchParams(location.search).get('id');

    const response = await fetch(`https://haji-api.ir/music?q=info&t=${id}`);
    const data = await response.json();

    handleData(data);

  }catch(e){
    if(e) {
      hidePreloader();

      showAlert('error', 'Something went Wrong !');
      setTimeout(hideAlert, 1000);
    } 
  }
}

function handleData(song) {
  const musicImage = document.querySelector('.description__image > img');
  const musicTitle = document.querySelector('.texts__titles > h3');
  const musicArtists = document.querySelector('.texts__titles > p');
  const lyricsContainer = document.querySelector('.description__lyrics > p');

  musicImage.alt = song.title;
  musicImage.src = song.image.cover.url;

  musicTitle.textContent = song.title;
  musicArtists.textContent = song.artists.map(artist => artist.fullName);

  lyricsContainer.textContent = song.lyrics ? song.lyrics : 'No lyrics Found...!';

  audioElem.src = song.audio.medium.url;

  hidePreloader();
}

function pauseMusic() {
  isPlaying = false;
  playBtn.firstElementChild.className = 'ri-play-line';

  audioElem.pause();
}

function playMusic() {
  isPlaying = true;
  playBtn.firstElementChild.className = 'ri-pause-line';

  audioElem.play();
}

function playOrPauseAudio() {
  if(!isPlaying){
    playMusic();
  }else{
    pauseMusic();
  } 
}
