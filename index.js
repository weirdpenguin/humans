document.addEventListener('DOMContentLoaded', function() {
    const apiBaseUrl = 'http://api.tvmaze.com/';
    const searchInput = document.getElementById('search_input');
    const searchShow = document.getElementById('search_show');
    const container = document.getElementById('container');
    const showPoster = document.getElementById('show_poster');
    const showAboutContainer = document.querySelector('.show_about_container');
    const seasonSelectorContainer = document.getElementById('season_selector_container');
    const episodesContainer = document.getElementById('episodes_container');
    const showNotExist = document.getElementById('show_not_exist');
    let showEpisodes = [];

    function onSubmit(event) {
        if (searchInput.value !== '') {
            fetch(apiBaseUrl + '/search/shows?q=' + searchInput.value)
                .then((response) => response.json())
                .then((showList) => getShow(showList[0]));
            
            searchInput.value = '';
        }
        event.preventDefault();
    }

    searchShow.addEventListener('submit', onSubmit);

    function getShow(show) {
        if (show) {
            fetch(apiBaseUrl + 'shows/' + show.show.id)
                .then((response) => response.json())
                .then((show) => renderShow(show));
    
            fetch(apiBaseUrl + 'shows/' + show.show.id + '/episodes')
                .then((response) => response.json())
                .then((episodes) => {
                    showEpisodes = episodes;
                    renderShowEpisodes();
                });
        } else {
            showNotExist.style.display = 'block';
            container.style.display = 'none';
        };
    }

    function renderShow(show) {
        showNotExist.style.display = 'none';
        container.style.display = 'block';
        showAboutContainer.innerHTML = '';
        showPoster.setAttribute('src', show.image.original);

        document.getElementById('show_name').textContent = show.name;

        let showStatus = document.createElement('div');
        showStatus.textContent = 'status: ' + show.status;
        showAboutContainer.append(showStatus);

        let showGenres = document.createElement('div');
        showGenres.textContent = 'genres: ' + show.genres.join(' | ');
        showAboutContainer.append(showGenres);

        let showRating = document.createElement('div');
        showRating.innerHTML = 'rating:&nbsp;';
        showAboutContainer.append(showRating);
        let ratingValue = document.createElement('span');
        ratingValue.textContent = show.rating.average || 'n/a';
        showRating.append(ratingValue);

        let showOfficialSite = document.createElement('a');
        showOfficialSite.setAttribute('href', show.officialSite);
        showOfficialSite.setAttribute('target', '_blank');
        showOfficialSite.textContent = 'Official site';
        showAboutContainer.append(showOfficialSite);

        document.getElementById('show_summary').innerHTML = show.summary;
    }

    function renderShowEpisodes() {
        let lastSeason = 0;

        seasonSelectorContainer.innerHTML = '';

        showEpisodes.forEach(function(episode) {
            if (episode.season > lastSeason) {
                lastSeason = episode.season;
            }
        });
        
        for (let i = 1; i <= lastSeason; i++) {
            let season = document.createElement('button');
            season.setAttribute('data-season', i);
            season.textContent = i;
            seasonSelectorContainer.append(season);
        }

        let defaultSeason = document.querySelector('.season_selector_container > button');
        renderSeason(1, defaultSeason);
    }

    seasonSelectorContainer.addEventListener('click', function(event) {
        let activeButton = event.target.closest('button');
        if (activeButton) {
            for (let i = 0; i < seasonSelectorContainer.children.length; i++) {
                seasonSelectorContainer.children[i].classList.remove('active_season');
            }
            activeButton.classList.add('active_season');
            renderSeason(event.target.dataset.season);
        }
    });

    function renderSeason(activeSeason) {
        episodesContainer.innerHTML = '';
        showEpisodes
            .filter(episode => episode.season == activeSeason)
            .forEach(function(episode) {
                let showEpisode = document.createElement('div');
                showEpisode.className = 'episode';
                episodesContainer.append(showEpisode);

                const showEpisodePoster = document.createElement('img');

                (episode.image !== null) ?
                showEpisodePoster.setAttribute('src', episode.image.medium) :
                showEpisodePoster.setAttribute('src', 'assets/posternull.png');

                showEpisodePoster.className = 'episode_poster';
                showEpisode.append(showEpisodePoster);

                const showEpisodeNumber = document.createElement('h6');
                showEpisodeNumber.className = 'episode_number';
                showEpisodeNumber.textContent = episode.number;
                showEpisode.append(showEpisodeNumber);

                const showEpisodeName = document.createElement('h6');
                showEpisodeName.className = 'episode_name';
                showEpisodeName.textContent = episode.name;
                showEpisode.append(showEpisodeName);
            });
    }
});