let maxPage;
let page = 1;
let infinityScroll;

searchFormBtn.addEventListener('click', ()=>{  
    location.hash = '#search=' + searchFormInput.value
})
trendingBtn.addEventListener('click', ()=>{
    location.hash = '#trends='
})
arrowBtn.addEventListener('click', ()=>{
    history.go(-1)
})


window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infinityScroll, {passive:false});

// window.addEventListener('storage', () => {
//     // When local storage changes, dump the list to
//     // the console.
//     console.log('addEvent')
//     console.log(JSON.parse(localStorage.getItem('sampleList')));
    
// });

// window.onstorage = () => {
//     // When local storage changes, dump the list to
//     // the console.
//     console.log('onstorage')
//     console.log(JSON.parse(localStorage.getItem('sampleList')));
//   };

function smoothscroll(){
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
         window.requestAnimationFrame(smoothscroll);
         window.scrollTo (0,currentScroll - (currentScroll/5));
    }
};
function navigator(){
    console.log({location})

    if(infinityScroll){
        window.addEventListener('scroll', infinityScroll,{passive:false});
        infinityScroll = undefined
    }
    
    if(location.hash.startsWith('#trends')){
        trendsPage()
    }else if(location.hash.startsWith('#search=')){
        searchPage()
    }else if(location.hash.startsWith('#movie=')){
        movieDetailsPage()
    }else if(location.hash.startsWith('#category=')){
        categoriePage()
    }else{
        homePage()
    }
    smoothscroll()

    if(infinityScroll){
        window.addEventListener('scroll', infinityScroll, {passive:false});
    }
}


function homePage(){
    console.log('HOME!!')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';

    arrowBtn.classList.add('inactive')
    arrowBtn.classList.remove('header-arrow--white')

    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.remove('inactive')
    categoriesPreviewSection.classList.remove('inactive')
    likedMoviesSection.classList.remove('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.add('inactive')



    getTrendingMoviesPreview()
    getCategoriesPreview()
    getLikedMovies()
}
function categoriePage(){
    console.log('CATEGORIES!!')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive')

    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');

    headerCategoryTitle.innerHTML = categoryName;
    smoothscroll()
    // document.body.scrollTop = 0; // For Safari
    // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    getMoviesByCategory(categoryId);

    infinityScroll = getPaginatedMoviesByCategory(categoryId)
}
function movieDetailsPage(){
    console.log('MOVIES!!')

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.add('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    const [_, movieId] = location.hash.split('=')

    // likedMoviesList()[movie.id] && buttonLikedDetailMovie.classList.add('movie-btn--liked');

    buttonLikedDetailMovie.addEventListener('click', () => {
        console.log('holis')
        buttonLikedDetailMovie.classList.toggle('movie-btn-id--liked')
        
        
    });
    
    getMovieById(movieId);
}
function searchPage(){
    console.log('SEARCH!!');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');

    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive')
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // ['#search' 'platzi']
    const [_, query] = location.hash.split('=');
    console.log(query)
    getMoviesBySearch(query)

    infinityScroll = getPaginatedMoviesBySearch(query);
}
function trendsPage(){
    console.log('TRENDS!!')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive')

    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    headerCategoryTitle.innerHTML = 'Tendencias'

    getTrendingMovies()
    infinityScroll = getPaginatedTrendingMovies;
}




