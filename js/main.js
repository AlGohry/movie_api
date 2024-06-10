const apiKey = '491da0b821e8330e3fe3936aa43889c8';

// TMDb configuration endpoint URL
const apiUrl = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;

// TMDb now playing movies and TV series endpoint URLs
const nowPlayingMoviesUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
const nowPlayingTvUrl = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}`;

// Fetch data from TMDb API
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(configData => {
        console.log('Images and the available sizes:', configData.images); // Log the image configurations

        // Fetch now playing movies
        fetch(nowPlayingMoviesUrl)
            .then(response => response.json())
            .then(nowPlayingMoviesData => {
                console.log('Now Playing Movies Data:', nowPlayingMoviesData); // Log the response

                // Extract movie IDs from the now playing movies data
                const movieIds = nowPlayingMoviesData.results.map(movie => movie.id);

                // Populate carousel with movie details
                const carouselIndicators = document.querySelector('.carousel-indicators');
                const carouselInner = document.querySelector('.carousel-inner');

                // Populate Shows For You section with Movie details
                const showsForYouSection = document.querySelector('.shows-content.row');

                movieIds.slice(0, 6).forEach((movieId, index) => {
                    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

                    // Fetch movie details
                    fetch(movieUrl)
                        .then(response => response.json())
                        .then(movieData => {
                            // Format rating to one decimal place
                            const formattedRating = movieData.vote_average.toFixed(1);

                            // Use a larger image size for the slider background
                            const backdropSize = 'w1280'; // You can adjust the size as needed

                            // Create carousel indicator
                            const indicator = document.createElement('button');
                            indicator.setAttribute('type', 'button');
                            indicator.setAttribute('data-bs-target', '#carouselExampleCaptions');
                            indicator.setAttribute('data-bs-slide-to', index.toString());
                            if (index === 0) {
                                indicator.classList.add('active');
                            }
                            carouselIndicators.appendChild(indicator);

                            // Create Shows For You card element
                            const showsForYouCard = document.createElement('div');
                            showsForYouCard.classList.add('col-md-4', 'p-2');

                            // Create carousel item
                            const carouselItem = document.createElement('div');
                            carouselItem.classList.add('carousel-item');
                            if (index === 0) {
                                carouselItem.classList.add('active');
                            }

                            // Create carousel item content
                            carouselItem.innerHTML = `
                                <img src="${configData.images.base_url}${backdropSize}${movieData.backdrop_path}" class="movie-bg d-block w-100" alt="...">
                                <div class="carousel-caption d-md-block">
                                    <h5 class="release text-white-50 ps-2 fs-6">New Releases</h5>
                                    <h1 class="font_80 mt-4 movie-title">${movieData.title}</h1>
                                    <h6 class="text-white">
                                        <span class="rating d-inline-block rounded-circle me-2 col_green movie-rate">${formattedRating}</span>
                                        <span class="col_green movie-score">IMDB SCORE</span>
                                        <span class="mx-3 movie-date">${movieData.release_date.substring(0, 4)}</span>
                                        <span class="col_red text-uppercase movie-genre">${movieData.genres.map(genre => genre.name).join(' . ')}</span>
                                    </h6>
                                    <p class="mt-4 movie-discretion">${movieData.overview}</p>
                                    <h5 class="btn-play mb-0 mt-4 text-uppercase">
                                        <a class="button" href="#">
                                            <i class="fa fa-youtube-play me-1"></i>
                                            Watch Trailer
                                        </a>
                                    </h5>
                                </div>
                            `;

                            carouselInner.appendChild(carouselItem);

                            // Get movie duration, resolution, and PG rating
                            const movieDuration = movieData.runtime ? `${movieData.runtime} min` : 'N/A';
                            const movieResolution = 'FHD'; // Assume resolution as 'HD', since TMDb API does not provide resolution info
                            const moviePG = movieData.adult ? '18+' : 'PG-13'; // Simplified PG rating based on 'adult' flag

                            // Create Shows For You card content
                            showsForYouCard.innerHTML = `
                                <div class="spec_1im clearfix position-relative">
                                    <div class="spec_1imi clearfix">
                                        <img src="${configData.images.base_url}w300${movieData.backdrop_path}" class="w-100" alt="abc">
                                    </div>
                                    <div class="spec_1imi1 row  m-0 w-100 h-100 clearfix position-absolute bg_col top-0">
                                        <div class="col-md-9 col-9 p-0">
                                            <div class="spec_1imi1l pt-2">
                                                <h6 class="mb-0 font_14 d-inline-block">
                                                    <a class="bg-black d-block text-white movie-resolution" href="#"> 
                                                        <span class="pe-2 ps-2 movie-resolution-number">1080</span> 
                                                        <span class="bg-white  d-inline-block text-black span_2 movie-resolution-name">${movieResolution}</span>
                                                    </a>
                                                </h6>
                                            </div>
                                        </div>
                                        <div class="col-md-3 col-3 p-0">
                                            <div class="spec_1imi1r text-end">
                                                <h6 class="text-white"><span class="rating d-inline-block rounded-circle me-2 col_green movie-rate">${formattedRating}</span></h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="spec_1im1 clearfix">
                                    <h6 class="text-light fw-normal font_14 mt-3 movie-duration">${movieDuration} .
                                        <span class="col_red">${movieData.genres.map(genre => genre.name).slice(0, 2).join(' . ')}</span>
                                        <span class="span_1 pull-right d-inline-block movie-PG">${moviePG}</span>
                                    </h6>
                                    <h5 class="mb-0 fs-6"><a class="text-white" href="#">${movieData.title}</a></h5>
                                </div>
                            `;
                            // Append series card to Shows For You section
                            showsForYouSection.appendChild(showsForYouCard);
                        })
                        .catch(error => {
                            console.error('There was a problem fetching movie details:', error);
                        });
                });
            })
            .catch(error => {
                console.error('There was a problem fetching now playing movies:', error);
            });

        // Fetch now playing TV series
        fetch(nowPlayingTvUrl)
            .then(response => response.json())
            .then(nowPlayingTvData => {
                console.log('Now Playing TV Series Data:', nowPlayingTvData); // Log the response

                // Extract TV series IDs from the now playing TV series data
                const tvSeriesIds = nowPlayingTvData.results.map(series => series.id);

                // Populate recent episodes section with TV series details
                const recentEpisodesSection = document.querySelector('.row.stream_2');

                tvSeriesIds.slice(0, 4).forEach(tvSeriesId => {
                    const seriesUrl = `https://api.themoviedb.org/3/tv/${tvSeriesId}?api_key=${apiKey}`;

                    // Fetch TV series details
                    fetch(seriesUrl)
                        .then(response => response.json())
                        .then(seriesData => {
                            // Create series card element
                            const seriesCard = document.createElement('div');
                            seriesCard.classList.add('col-md-3', 'pe-0');

                            // Create series card content
                            seriesCard.innerHTML = `
                                <div class="stream_2im clearfix position-relative">
                                    <div class="stream_2im1 clearfix">
                                        <div class="grid clearfix">
                                            <figure class="effect-jazz mb-0">
                                                <a href="#"><img src="${configData.images.base_url}w300${seriesData.poster_path}" class="w-100" alt="${seriesData.name}"></a>
                                            </figure>
                                        </div>
                                    </div>
                                    <div class="stream_2im2 position-absolute w-100 h-100 p-3 top-0  clearfix">
                                        <h6 class="font_14 col_red text-uppercase">${seriesData.genres.map(genre => genre.name).join(' . ')}</h6>
                                        <h4 class="text-white">${seriesData.name}</h4>
                                        <h6 class="font_14 mb-0 text-white">
                                            <a class="text-white me-1 font_60 align-middle lh-1" href="#">
                                                <i class="fa fa-play-circle"></i>
                                            </a>
                                            SEASON ${seriesData.number_of_seasons} - ${seriesData.first_air_date.substring(0, 4)}
                                        </h6>
                                    </div>
                                </div>
                            `;

                            // Append series card to recent episodes section
                            recentEpisodesSection.appendChild(seriesCard);
                        })
                        .catch(error => {
                            console.error('There was a problem fetching TV series details:', error);
                        });
                });
            })
            .catch(error => {
                console.error('There was a problem fetching now playing TV series:', error);
            });
    })
    .catch(error => {
        console.error('There was a problem fetching data:', error);
    });
