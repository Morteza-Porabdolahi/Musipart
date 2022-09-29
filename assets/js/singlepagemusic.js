const playBtn = document.querySelector('.control:nth-child(2)');
const audioElem = document.querySelector('audio');

playBtn.addEventListener('click',playOrPauseAudio);
window.addEventListener('load',getSingleMuaic);

let isPlaying = false;

async function getSingleMuaic() {
    const id = new URLSearchParams(location.search).get('id');
    const response = await fetch(`https://haji-api.ir/music?q=info&t=${id}`);
    const data = await response.json();

    handleData(data);
}

function handleData(song) {
    const musicImage = document.querySelector('.description__image > img');
    const musicTitle = document.querySelector('.texts__titles > h3');
    const lyricsContainer = document.querySelector('.description__lyrics > p');

    musicImage.alt = song.title;
    musicImage.src = song.image.cover.url;
    musicTitle.textContent = song.title;

    lyricsContainer.textContent = song.lyrics ? song.lyrics : 'No lyrics Found...!';

    audioElem.src = song.audio.medium.url;
    
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
