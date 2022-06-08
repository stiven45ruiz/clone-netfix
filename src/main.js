//DATA
const leng = window.navigator.language.split('-')[0]
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params:{
        'api_key': API_KEY,
        'language': leng
    },
});

const likedMoviesList = ()=>{
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if(item){
        movies = item
    }else{
        movies = {};
    }

    return movies;
}

const likeMovie = (movie)=>{
    const likedMovies = likedMoviesList()

    console.log(likedMovies)

    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;

    }else{
        likedMovies[movie.id] = movie
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies))

    //window.location.reload()

    if (location.hash == ''){
        getLikedMovies();
        getTrendingMoviesPreview(); 
  }
}

const API_URL = 'https://api.themoviedb.org/3/';
const API_URL_TRENDING = 'trending/movie/day';
const API_URL_GENRE = 'genre/movie/list';
const API_URL_BYCATEGORY = 'discover/movie';
const API_URL_SEARCH = 'search/movie'
const BASE_URL_IMG = 'https://image.tmdb.org/t/p/w300';
const BASE_URL_IMG_LARGE = 'https://image.tmdb.org/t/p/w500';

// HELPERS OR UTILS

const lazyLoader = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        // console.log(entry)

        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-src')
            entry.target.setAttribute('src', url)
        }
    })
});



const createMovies = (
    movies, 
    container, 
    {
        lazyLoad = true,
        clean = true,
    } = {}
    )=>{
    if (clean){
        container.innerHTML = ''
    }
    

    movies.forEach(movie => {
        
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        // movieContainer.addEventListener('click', ()=>{
        //     location.hash = '#movie=' + movie.id
        // });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-src': 'src', 
            `${BASE_URL_IMG}${movie.poster_path}`
        );
        
        movieImg.addEventListener('click', ()=>{
            location.hash = '#movie=' + movie.id
        });
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src', 
                'https://www.sinrumbofijo.com/wp-content/uploads/2016/05/default-placeholder.png'
            )
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');

        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');

        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie);
            
        });

        if(lazyLoad){
            lazyLoader.observe(movieImg);
        };

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn)
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

    createMovies(movies, trendingMoviesPreviewList, true)
    
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
    maxPage = data.total_pages;
    // console.log(data, movies);

    createMovies( movies, genericSection)
    
}
const getPaginatedMoviesByCategory =(id) =>{

    return async function(){
        const { 
            scrollTop, 
            scrollHeight, 
            clientHeight 
        } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 10)
    
        const pageIsNotMaz = page < maxPage
        if(scrollIsBottom && pageIsNotMaz){
            page++;
            const {data} = await api(`${API_URL_BYCATEGORY}`,{
                params:{
                    with_genres: id,
                    page,
                }
            });
    
            const movies = data.results;
            //console.log(data, movies);
    
            createMovies(movies, genericSection, {clean: false})
        }
    }
}

const getMoviesBySearch = async(query) =>{
    const {data} = await api(`${API_URL_SEARCH}`,{
        params:{
            query,
        }
    });
    const movies = data.results;

    maxPage  = data.total_pages;

    console.log(maxPage);

    createMovies( movies, genericSection)
    
}
const getPaginatedMoviesBySearch =(query) =>{

    return async function(){
        const { 
            scrollTop, 
            scrollHeight, 
            clientHeight 
        } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 10)
    
        const pageIsNotMaz = page < maxPage
        if(scrollIsBottom && pageIsNotMaz){
            page++;
            const {data} = await api(`${API_URL_SEARCH}`,{
                params:{
                    query,
                    page,
                }
            });
    
            const movies = data.results;
            //console.log(data, movies);
    
            createMovies(movies, genericSection, {clean: false})
        }
    }
}




const getTrendingMovies = async() =>{
    const {data} = await api(`${API_URL_TRENDING}`);
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, {clean: true})

    // const btnloadMore = document.createElement('button');
    // btnloadMore.innerText = 'Cargar más';
    // btnloadMore.addEventListener('click', getPaginatedTrendingMovies)
    // genericSection.appendChild(btnloadMore)
    
}


const getPaginatedTrendingMovies = async() =>{

    const { 
        scrollTop, 
        scrollHeight, 
        clientHeight 
    } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 10)

    const pageIsNotMaz = page < maxPage
    if(scrollIsBottom && pageIsNotMaz){
        page++;
        const {data} = await api(`${API_URL_TRENDING}`,{
            params:{
                page,
            },
        });

        const movies = data.results;
        //console.log(data, movies);

        createMovies(movies, genericSection, {clean: false})
    }

    // const btnloadMore = document.createElement('button');
    // btnloadMore.innerText = 'Cargar más';
    // btnloadMore.addEventListener('click', getPaginatedTrendingMovies)
    // genericSection.appendChild(btnloadMore)
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

const getLikedMovies = () =>{
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies)

    createMovies(moviesArray, likedMoviesListArticle,{clean: true})
    console.log(likedMovies)
}

const whatch = async(id) =>{
    const {data} = await api(`movie/${id}/watch/providers`)
    const view = data.results;
    console.log(view);
}