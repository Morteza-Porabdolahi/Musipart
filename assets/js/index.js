window.addEventListener('load', getAllSongs);


async function getAllSongs() {
    // take datas and put them into an object named dataObj
    const datasObj = {
        // the innermost await(keyword) is for fetching the response and the outermost await(keyword) is for json() function
        newMusics :(await(await fetch('https://haji-api.ir/music?q=new')).json()).results,
        topArtists :(await(await fetch('https://haji-api.ir/music?q=trend')).json()).results,
        dailyMusics :(await(await fetch('https://haji-api.ir/music?q=day')).json()).results,
        weeklyMusics :(await(await fetch('https://haji-api.ir/music?q=week')).json()).results,
    }

    manipulateDatas(datasObj);
}

function manipulateDatas(datas) {
    const newDatas = {};

    // take 6 elemenets of every array and put them into newDatas Obj
    for(let key in datas){
        newDatas[key] = datas[key].splice(datas.length < 6 ? 0 : datas.length - 6 , 6);
    }

    createHtmlElementsFromDatas(newDatas);
}

function createHtmlElementsFromDatas(newDatas) {
    let htmlCard;
    let dataArr;

    let container;
    let currentData;

    for(let key in newDatas){
        // make invidual Container for every data Array
        container = document.createElement('div');
        container.className = 'section__content';

        // save the data Arrays in variable called dataArr
        dataArr = newDatas[key];
        
        // Loop on dataArr
        for(let i = 0 ; i < dataArr.length ; i++){
            currentData = dataArr[i];
            // the artist cards have diffrent styles from music cards , then a condition is necessary
            if(key == 'topArtists'){
                htmlCard =  `
                    <div class="artist-card">
                        <div class="artist-card__img-container">
                            <img class="artist-card__img" src="${currentData.image.cover.url}"/>
                        </div>
                        <div class="artist-card__informations">
                            <a href="/pages/artistmusics.html" class="informations__artist-name">${currentData.fullName}</a>
                        </div>
                    </div>`;
                // put the cards in their special wrapper
                container.insertAdjacentHTML('beforeend',htmlCard);
            } else{
                htmlCard =  `
                    <div class="music-card">
                        <div class="music-card__img-container">
                            <img class="music-card__img" src="${currentData.image.cover.url}" />
                            <button onclick="playEntireMusic(event,'${currentData.id}')" class="music-card__play-btn">
                                <i class="ri-play-line"></i>
                            </button>
                        </div>
                        <div class="music-card__informations">
                            <a class="informations__music-name" href="/pages/singlemusicpage.html">${currentData.title}</a>
                            ${currentData.artists.map(artist => `<a class="informations__music-artist" href="/pages/artistmusics.html">${artist.fullName}</a>`)}
                        </div>
                    </div>`;
                // put the cards in their special wrapper
                container.insertAdjacentHTML('beforeend',htmlCard);
            }
        }
        // call insertToDom with key and container(wrapper) args
        insertInDom(key,container);
    }
}

function insertInDom(containerClass,toInsert) {
    // the object key names is equal to container classes
    const container = document.querySelector(`.${containerClass}`);
    // append the wrapper in container
    container.appendChild(toInsert);
}

