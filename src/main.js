const API_URL = 'https://api.themoviedb.org/3';
const API_URL_TRENDING = '/trending/movie/day';
const API_URL_GENRE = '/genre/movie/list';
const BASE_URL_IMG = 'https://image.tmdb.org/t/p/w300';


const getTrendingMoviesPreview = async() =>{
    const res = await fetch(`${API_URL}${API_URL_TRENDING}?api_key=${API_KEY}`);
    const data = await res.json();

    const movies = data.results;
    console.log(data, movies);

    movies.forEach(movie => {
        const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', `${BASE_URL_IMG}${movie.poster_path}`);


        movieContainer.appendChild(movieImg);
        trendingPreviewMoviesContainer.appendChild(movieContainer);
    });
}

const getCategoriesPreview = async() =>{
    const res = await fetch(`${API_URL}${API_URL_GENRE}?api_key=${API_KEY}`);
    const data = await res.json();

    const categories = data.genres;
    console.log(data, categories);

    categories.forEach(category => {
        const categoriesPreviewMoviesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', `id${category.id}`);
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        categoriesPreviewMoviesContainer.appendChild(categoryContainer);
    });
}


getTrendingMoviesPreview()
getCategoriesPreview()