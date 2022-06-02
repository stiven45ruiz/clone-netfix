const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params:{
        'api_key': API_KEY,
    },
});

const API_URL = 'https://api.themoviedb.org/3/';
const API_URL_TRENDING = 'trending/movie/day';
const API_URL_GENRE = 'genre/movie/list';
const API_URL_BYCATEGORY = 'discover/movie';
const API_URL_SEARCH = 'search/movie'
const BASE_URL_IMG = 'https://image.tmdb.org/t/p/w300';
const BASE_URL_IMG_LARGE = 'https://image.tmdb.org/t/p/w500';

// HELPERS OR UTILS
const createMovies = (movies, container)=>{
    container.innerHTML = ''

    movies.forEach(movie => {
        
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', ()=>{
            location.hash = '#movie=' + movie.id
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', `${BASE_URL_IMG}${movie.poster_path}`);


        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
    
}

const createCategories =(categories,  container) =>{
    container.innerHTML = '';

    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', `id${category.id}`);
        categoryTitle.addEventListener('click',()=>{
            location.hash = `#category=${category.id}-${category.name}`
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
    smoothscroll()
}


//CALLS TO API

const getTrendingMoviesPreview = async() =>{
    const {data} = await api(`${API_URL_TRENDING}?limit=5`);

    const movies = data.results;
    //console.log(data, movies);

    createMovies(movies, trendingMoviesPreviewList)
    
}

const getCategoriesPreview = async() =>{
    const {data} = await api(`${API_URL_GENRE}`);
    
    const categories = data.genres;
    console.log(data, categories);

    createCategories(categories, categoriesPreviewList)
    
}

const getMoviesByCategory = async(id) =>{
    const {data} = await api(`${API_URL_BYCATEGORY}`,{
        params:{
            with_genres: id,
        }
    });
    const movies = data.results;
    // console.log(data, movies);

    createMovies( movies, genericSection)
    
}

const getMoviesBySearch = async(query) =>{
    const {data} = await api(`${API_URL_SEARCH}`,{
        params:{
            query,
        }
    });
    const movies = data.results;
    // console.log(data, movies);

    createMovies( movies, genericSection)
    
}
const getTrendingMovies = async() =>{
    const {data} = await api(`${API_URL_TRENDING}`);

    const movies = data.results;
    //console.log(data, movies);

    createMovies(movies, genericSection)
    
}
const getMovieById = async(id) =>{
    const {data: movie} = await api(`movie/${id}`);

    const movieImgUrl = BASE_URL_IMG_LARGE + movie.poster_path;
    console.log(movie)
    
    headerSection.style.background = `
        linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
        url(${movieImgUrl})
    `;
    
    movieDetailTitle.textContent = movie.title;
    movieDetailScore.textContent = movie.vote_average;
    movieDetailDescription.textContent =  movie.overview;
    movieDetailPremiere.textContent = movie.release_date;
    
    
    
    createCategories(movie.genres, movieDetailCategoriesList);
    relatedMoviesId(id);
    recommendedMoviesId(id);
    whatch(id)
}

const relatedMoviesId = async(id) =>{
    const {data} = await api(`movie/${id}/similar`)

    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer)
}
const recommendedMoviesId = async(id) =>{
    const {data} = await api(`movie/${id}/recommendations`);
    const recommendedMovies = data.results;

    createMovies(recommendedMovies, recommendedMoviesContainer)
}

const whatch = async(id) =>{
    const {data} = await api(`movie/${id}/watch//providers`)
    const view = data.results;
    console.log(view);
}