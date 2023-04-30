let poster1 = document.querySelector('#poster1'),
poster2 = document.querySelector('#poster2'),
poster3 = document.querySelector('#poster3'),
request = new XMLHttpRequest(),
divFilmList = document.querySelector('#filmList'),
poster = document.querySelector('#main-poster'),
Title = document.querySelector('#title'),
year = document.querySelector('#year'),
timeGenre = document.querySelector('#timeGenre'),
raiting = document.querySelector('#raiting'),
desc = document.querySelector('#description'),
trailer = document.querySelector('#trailer'),
input = document.querySelector("#input");
imgBack = document.querySelector("#background-poster");


function alertOpen(obj) {
	if(obj == 'alertOpen1') {
		alert('Марсианская миссия «Арес-3» в процессе работы была вынуждена экстренно покинуть планету из-за надвигающейся песчаной бури. Инженер и биолог Марк Уотни получил повреждение скафандра во время песчаной бури. Сотрудники миссии, посчитав его погибшим, эвакуировались с планеты, оставив Марка одного. Очнувшись, Уотни обнаруживает, что связь с Землёй отсутствует, но при этом полностью функционирует жилой модуль. Главный герой начинает искать способ продержаться на имеющихся запасах еды, витаминов, воды и воздуха ещё 4 года до прилёта следующей миссии «Арес-4».')
	} else if(obj == 'alertOpen2') {
		alert('Ушлый наркоторговец придумал схему нелегального обогащения — с использованием поместий обедневшей английской аристократии. На успешный бизнес заглядываются партнер-еврей, китайская диаспора, темнокожие спортсмены и русский олигарх.')
	} else if ( obj == 'alertOpen3') {
		alert('На следующее утро после празднования 85-летия известного автора криминальных романов Харлана Тромби виновника торжества находят мёртвым. Налицо - явное самоубийство, но полиция по протоколу опрашивает всех присутствующих в особняке членов семьи, хотя, в этом деле больше заинтересован частный детектив Бенуа Блан. Тем же утром он получил конверт с наличными от неизвестного и заказ на расследование смерти Харлана. Не нужно быть опытным следователем, чтобы понять, что все приукрашивают свои отношения с почившим главой семейства, но Блану достаётся настоящий подарок - медсестра покойного, которая физически не выносит ложь.')
	}
}

function addFilm(film) {
	let div = document.createElement("div"),
	divImg = document.createElement("div"),
	p = document.createElement("p");

	div.classList = 'slide';
	divImg.classList = 'poster';
	divImg.style.background = 'url('+film.posterUrlPreview+')';
	divImg

	p.innerText = film.nameRu;

	div.appendChild(divImg);
	div.appendChild(p);

	divFilmList.appendChild(div);
	div.addEventListener('click', ()=> { getFilmInfo(film.filmId) });
	div.addEventListener('click', ()=> { name(film.filmId) });
}

function getFilmsList() {
	let request = new XMLHttpRequest();
    request.open('GET','https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1', false);
    request.setRequestHeader('X-API-KEY', '463c0c7b-28e6-4e74-a51b-39089e40d74d');
    request.send();

    let filmsList = JSON.parse(request.response);

    for (let i=0; i<filmsList.films.length; i++) {
    	addFilm(filmsList.films[i]);
    }
}

function getFilmInfo(id) {
	document.body.scrollTo({
    	top:0,
    	behavior: "smooth"
    })

    let request = new XMLHttpRequest();

    request.open('GET','https://kinopoiskapiunofficial.tech/api/v2.1/films/'+id, false);
    request.setRequestHeader('X-API-KEY', '463c0c7b-28e6-4e74-a51b-39089e40d74d');
    request.send();

    let filmInfo = JSON.parse(request.response);

    console.log(filmInfo);
    editFilmInfo(filmInfo.data);

    //getTrailerList(id);


}

function name(id) {
	document.body.scrollTo({
    	top:0,
    	behavior: "smooth"
    })

    let request = new XMLHttpRequest();

    request.open('GET','https://kinopoiskapiunofficial.tech/api/v2.1/films/'+id, false);
    request.setRequestHeader('X-API-KEY', '463c0c7b-28e6-4e74-a51b-39089e40d74d');
    request.send();

    let filmInfo = JSON.parse(request.response);

    return filmInfo.data.nameRu


}

function editFilmInfo(film) {
	clearInfo();
	poster.style.background = 'url('+film.posterUrlPreview+')';
	title.innerText = film.nameRu;
	year.innerText = film.year;
	timeGenre.innerText = film.filmLength + ' | ' ;
	raiting.innerText = film.ratingMpaa;
	desc.innerText = film.description;
	imgBack.src = film.posterUrlPreview;

	for (let i=0; i<film.genres.length; i++) {
		timeGenre.innerText += " " + film.genres[i].genre;
	}


}

function clearInfo() {
	poster.style.background = ' ';
	title.innerText = " ";
	year.innerText = " ";
	timeGenre.innerText = " ";
	raiting.innerText = " ";
	desc.innerText = " ";
}

function getTrailerList(id) {
	let request = new XMLHttpRequest();

    request.open('GET','https://kinopoiskapiunofficial.tech/api/v2.1/films/'+ id +'/videos', false);
    request.setRequestHeader('X-API-KEY', '463c0c7b-28e6-4e74-a51b-39089e40d74d');
    request.send();

    let filmList = JSON.parse(request.response);
    let url = getTrailerUrl(filmList.trailers);
    editIframeUrl(url);
}

function getTrailerUrl(videoUrlList) {
	let url;
	for (let i=0; i<videoUrlList.length; i++) {
		if (videoUrlList[i].site == "KINOPOISK_WIDGET") {
			url = videoUrlList[i].url;
			break;
		}
	}
	return url;
}

function searchFilms(event) {

	if (event.keyCode == 13) {
		event.preventDefault();
		let request = new XMLHttpRequest();

	    request.open('GET','https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='+input.value+'&page=1', false);
	    request.setRequestHeader('X-API-KEY', '463c0c7b-28e6-4e74-a51b-39089e40d74d');
	    request.send();

	    let foundFilmList = JSON.parse(request.response);

	    divFilmList.innerHTML = "";

	    for (let i=0; i<foundFilmList.films.length; i++){
	    	addFilm(foundFilmList.films[i]);
	    }
    }
}

window.addEventListener('keydown', (e)=> {searchFilms(e)});

getFilmsList()