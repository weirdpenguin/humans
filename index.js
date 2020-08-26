document.addEventListener('DOMContentLoaded', function() {
    const apiBAseUrl = 'http://api.tvmaze.com/';
    const showId = '1363';
    let xhr = new XMLHttpRequest();

    xhr.open('GET', apiBAseUrl + 'shows/' + showId);
    xhr.send();
    xhr.onload = function() {
        let show = JSON.parse(xhr.response);
        renderShow(show);
    };

    function renderShow(show) {
        document.getElementById('showName').textContent = show.name;
        document.getElementById('showPoster').setAttribute('src', show.image.original);
        document.getElementById('showStatus').innerHTML += '&nbsp;' + show.status;
        document.getElementById('showGenres').innerHTML += '&nbsp;' + show.genres.join(' | ');
        document.getElementById('showRating').innerHTML += '&nbsp;' + show.rating.average;
        document.getElementById('showOfficialSite').setAttribute('href', show.officialSite);
        document.getElementById('showOfficialSite').innerHTML = '&nbsp;' + show.officialSite;
        document.getElementById('showSummary').innerHTML = show.summary;
    }
})