document.addEventListener('DOMContentLoaded', function() {
    const apiBaseUrl = 'http://api.tvmaze.com/';
    const showId = '1363';

    fetch(apiBaseUrl + 'shows/' + showId)
        .then((resporse) => {
            return resporse.json();
        })
        .then((show) => renderShow(show));

    fetch(apiBaseUrl + 'shows/' + showId + '/episodes')
        .then((resporse) => {
            return resporse.json();
        })
        .then((episodes) => renderShowEpisodes(episodes));

    // let xhr = new XMLHttpRequest();
    // let xhrEpisodes = new XMLHttpRequest();

    // xhr.open('GET', apiBaseUrl + 'shows/' + showId);
    // xhr.send();
    // xhr.onload = function() {
    //     let show = JSON.parse(xhr.response);
    //     renderShow(show);
    // };

    // xhrEpisodes.open('GET', apiBaseUrl + 'shows/' + showId + '/episodes');
    // xhrEpisodes.send();
    // xhrEpisodes.onload = function() {
    //     let showEpisodes = JSON.parse(xhrEpisodes.response);
    //     renderShowEpisodes(showEpisodes);
    // };

    function renderShow(show) {
        document.getElementById('showName').textContent = show.name;
        document.getElementById('showPoster').setAttribute('src', show.image.original);
        document.getElementById('showStatus').textContent = show.status;
        document.getElementById('showGenres').textContent = show.genres.join(' | ');
        document.getElementById('showRating').textContent = show.rating.average;
        document.getElementById('showOfficialSite').setAttribute('href', show.officialSite);
        document.getElementById('showOfficialSite').innerHTML = show.officialSite;
        document.getElementById('showSummary').innerHTML = show.summary;
    };

// ________________________________________________________________________________
    function renderShowEpisodes(showEpisodes) {
        let episodesContainer = document.getElementById('episodesContainer');
        let seasonSelectorContainer = document.getElementById('seasonSelectorContainer');
        let lastSeason = 0;
        let episodesList = [];

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
        };

        seasonSelectorContainer.addEventListener('click', function(event) {
            let activeSeason = event.target.dataset.season;
            if (activeSeason !== null) {
                renderSeason(activeSeason);
            }
        });

        function renderSeason(activeSeason) {
            showEpisodes.forEach(function(episodes) {
                if (episodes.season == (activeSeason)) {
                    // console.log(episodes);
                    episodesList.push(episodes);
                }
            })
            // console.log(episodesList);
            showSeason(episodesList);
        };

        function showSeason(episodes) {
            console.log(episodes);
            episodes.forEach(function(episode) {
                let showEpisode = document.createElement('div');
                showEpisode.className = 'episode';
                episodesContainer.append(showEpisode);
                let showEpisodeNumber = document.createElement('p');
                showEpisodeNumber.className = 'episode_number';
                showEpisodeNumber.textContent = episode.number;
                showEpisode.append(showEpisodeNumber);
            })
        };
    };
});