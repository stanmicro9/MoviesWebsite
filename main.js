const API_key ="66652789f00bdd2955980e1dfa7fd36b";
const endpoints = {
    nowPlaying: `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_key}`,
    popular: `https://api.themoviedb.org/3/movie/popular?api_key=${API_key}`,
    trending: `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_key}`,
    upcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_key}`,
    topRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_key}`
};

const options = ["Now Playing", "Popular", "Trending", "Upcoming", "Top Rated"];

var moviesContainer = document.querySelector('#movies-container');
var sideBarButton = document.querySelector('.middle');
var menu =document.querySelector('#menu');
var search= document.querySelector('#searchContainer')
const menuList = document.querySelector('#menuList');
const loadingIndicator = document.querySelector('#loading-indicator');

//default fetch
getMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_key}`); //home page default



function display(movies) {
    moviesContainer.innerHTML = ''; //clearing previous results
    movies.forEach(movie => {
        var movieElement = document.createElement('div');
        movieElement.classList.add('movie', 'col-md-4', 'mt-4');
        
        var moviePoster = document.createElement('img');
        moviePoster.src = `https://image.tmdb.org/t/p/w780${movie.poster_path}`;
        moviePoster.classList.add("movie-img")
        moviePoster.style.transition = "opacity 0.5s ease";
        movieElement.appendChild(moviePoster);

        var movieDetails = document.createElement('div');
        movieDetails.classList.add('movie-details');
        movieDetails.style.display = 'none'; // Initially hidden
        movieDetails.innerHTML = `
            <h3>${movie.title}</h3>
            <p>${movie.overview}</p>
        `;
        movieElement.appendChild(movieDetails);
        moviesContainer.appendChild(movieElement);

        const imgElement = movieElement.querySelector('img');
        imgElement.addEventListener('mouseover', () => {
            imgElement.style.opacity = 0; //Fade out
            setTimeout(() => {
                imgElement.src = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;
                imgElement.style.opacity = 1; //Fade in
            }, 500); //Delay matches the transition duration
            movieDetails.style.display = 'block'; //showing movie details
        });

        imgElement.addEventListener('mouseout', () => {
            imgElement.style.opacity = 0; // Fade out
            setTimeout(() => {
                imgElement.src = `https://image.tmdb.org/t/p/w780${movie.poster_path}`;
                imgElement.style.opacity = 1; //Fade in
            }, 500); //Delay matches the transition duration
            movieDetails.style.display = 'none'; //Hiding movie details
        });
    });
} 

sideBarButton.addEventListener('click', function(){
    if(menu.classList.contains('d-none')){
        menu.classList.remove('d-none');
        sideBarButton.innerHTML=`<i class="fa-solid fa-x"></i>`;
    }else{
        menu.classList.add('d-none');
        sideBarButton.innerHTML=`<i class="fa-solid fa-bars"></i>`;
    }
})

options.forEach((option, index) => {
    const optionEle = document.createElement('li');
    optionEle.classList.add('py-3', 'ps-3','fs-4','color-gray');
    optionEle.textContent = option;
    optionEle.addEventListener('click', () => {
        const endpointKey = Object.keys(endpoints)[index];
        getMovies(endpoints[endpointKey]);
        console.log(endpoints[endpointKey])
        menu.classList.add('d-none');
        sideBarButton.innerHTML=`<i class="fa-solid fa-bars"></i>`;
    });
    menuList.appendChild(optionEle);
});

// function getMovies(endpoint) {
//     fetch(endpoint)
//         .then(response => response.json())
//         .then(data => display(data.results))
//         .catch(error => console.error('Error fetching data:', error));
// }

//fetchig movies with error handling
function getMovies(endpoint) {
    loadingIndicator.classList.remove('d-none');
    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            display(data.results);
            loadingIndicator.classList.add('d-none');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Fetch Error',
                text: 'An error occurred while fetching movie data. Please try again later.',
            });
            loadingIndicator.classList.add('d-none');
        });
}

const searchInput = document.querySelector('#searchInput');
// searchInput.addEventListener('input', () => {
//     const query = searchInput.value.trim();
//     if (query.length >= 3) {
//         const searchEndpoint = `https://api.themoviedb.org/3/search/movie?api_key=${API_key}&query=${query}`;
//         fetch(searchEndpoint)
//             .then(response => response.json())
//             .then(data => {
//                 if (data.results.length === 0) {
//                     displayNoResults();
//                 } else {
//                     display(data.results);
//                 }
//             })
//             .catch(error => console.error('Error searching movies:', error));
//     }
// });
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length >= 3) {
        const searchEndpoint = `https://api.themoviedb.org/3/search/movie?api_key=${API_key}&query=${query}`;
        fetch(searchEndpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.results.length === 0) {
                    displayNoResults();
                } else {
                    display(data.results);
                }
            })
            .catch(error => {
                console.error('Error searching movies:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Search Error',
                    text: 'An error occurred while searching for movies. Please try again later.',
                });
            });
    }
});

function displayNoResults() {
    Swal.fire({
        icon: 'info',
        title: 'No Results Found',
        text: 'No movies found matching your search criteria.',
        footer: '<button onclick="returnToHome();" class="btn btn-primary">Return to Home</button>',
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false, //preventing closing by clicking outside
    });
}

function returnToHome() {
    getMovies(endpoints.nowPlaying);
    searchInput.value=''; //reseting input
    Swal.close(); //closing the SweetAlert dialog
}


//form and input elements
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const ageInput = document.getElementById('age');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

//displaying error message for an input field
function showError(input, message) {
    const feedbackDiv = input.nextElementSibling; //getting the next sibling div (for error feedback)
    feedbackDiv.textContent = message; //setting error message text
    input.classList.add('is-invalid'); //adding Bootstrap class for invalid feedback
}

//clearing error message for an input field
function clearError(input) {
    const feedbackDiv = input.nextElementSibling;
    feedbackDiv.textContent = '';
    input.classList.remove('is-invalid'); //removing Bootstrap class for invalid feedback
}

//using regex for validation:
function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}
function isValidPhone(phone) {
    const pattern = /^01[0-2]\d{8}$/;
    return pattern.test(phone);
}

function validateForm() {
    let isValid = true;

    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Name is required.');
        isValid = false;
    } else {
        clearError(nameInput);
    }

    if (emailInput.value.trim() === '') {
        showError(emailInput, 'Email is required.');
        isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Enter a valid email address.');
        isValid = false;
    } else {
        clearError(emailInput);
    }

    if (phoneInput.value.trim() === '') {
        showError(phoneInput, 'Phone number is required.');
        isValid = false;
    } else if (!isValidPhone(phoneInput.value.trim())) {
        showError(phoneInput, 'Enter a valid phone number (###-##-###).');
        isValid = false;
    } else {
        clearError(phoneInput);
    }

    if (ageInput.value.trim() === '') {
        showError(ageInput, 'Age is required.');
        isValid = false;
    } else if (ageInput.value < 18 || ageInput.value > 100) {
        showError(ageInput, 'Age must be between 18 and 100.');
        isValid = false;
    } else {
        clearError(ageInput);
    }

    if (passwordInput.value.trim() === '') {
        showError(passwordInput, 'Password is required.');
        isValid = false;
    } else if (passwordInput.value.length < 8) {
        showError(passwordInput, 'Password must be at least 8 characters.');
        isValid = false;
    } else {
        clearError(passwordInput);
    }

    if (confirmPasswordInput.value.trim() === '') {
        showError(confirmPasswordInput, 'Please confirm your password.');
        isValid = false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
        showError(confirmPasswordInput, 'Passwords do not match.');
        isValid = false;
    } else {
        clearError(confirmPasswordInput);
    }

    return isValid;
}

//form submission
contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validateForm()) {
        Swal.fire({
            icon: 'success',
            title: 'Form Submitted!',
            text: 'Thank you for contacting us.',
        });
        contactForm.reset();
    }
});
