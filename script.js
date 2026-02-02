/* ================= DOM ELEMENTS ================= */

const resultsDiv = document.getElementById("results");
const loader = document.getElementById("loader");
const genreFilter = document.getElementById("genreFilter");

/* ================= GLOBAL STATE ================= */

let allSongs = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

/* ================= SEARCH MUSIC ================= */

async function searchMusic() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    alert("Please enter a search term");
    return;
  }

  resultsDiv.innerHTML = "";
  loader.style.display = "block";

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=25`
    );
    const data = await response.json();

    allSongs = data.results || [];
    populateGenres(allSongs);
    displayResults(allSongs);
  } catch (err) {
    resultsDiv.innerHTML = `<p class="empty">Error fetching music 😢</p>`;
  } finally {
    loader.style.display = "none";
  }
}

/* ================= DISPLAY RESULTS ================= */

function displayResults(songs) {
  resultsDiv.innerHTML = "";

  if (!songs.length) {
    resultsDiv.innerHTML = `<p class="empty">No results found 🎧</p>`;
    return;
  }

  songs.forEach(song => {
    const year = song.releaseDate ? song.releaseDate.split("-")[0] : "N/A";

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${song.artworkUrl100.replace("100x100", "300x300")}">
      <h3>${song.trackName || "Unknown Track"}</h3>
      <p><strong>Artist:</strong> ${song.artistName}</p>
      <p><strong>Genre:</strong> ${song.primaryGenreName || "N/A"}</p>
      <p><strong>Year:</strong> ${year}</p>
      ${song.previewUrl ? `<audio controls src="${song.previewUrl}"></audio>` : ""}
      <button class="fav-btn">❤️ Add to Favorites</button>
      <button class="play-btn">➕ Add to Playlist</button>
    `;

    card.querySelector(".fav-btn").addEventListener("click", () => {
      addToFavorites(song.trackId);
    });

    card.querySelector(".play-btn").addEventListener("click", () => {
      addToPlaylist(song.trackId);
    });

    resultsDiv.appendChild(card);
  });
}

/* ================= FAVORITES ================= */

function addToFavorites(trackId) {
  const song = allSongs.find(s => s.trackId === trackId);
  if (!song) return;

  if (!favorites.some(s => s.trackId === trackId)) {
    favorites.push(song);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
}

function removeFromFavorites(trackId) {
  favorites = favorites.filter(song => song.trackId !== trackId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

function renderFavorites() {
  const favDiv = document.getElementById("favorites");
  favDiv.innerHTML = "";

  if (!favorites.length) {
    favDiv.innerHTML = `<p class="empty">No favorites yet ❤️</p>`;
    return;
  }

  favorites.forEach(song => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${song.trackName}</h3>
      <p>${song.artistName}</p>
      <button class="remove-btn">❌ Remove</button>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromFavorites(song.trackId);
    });

    favDiv.appendChild(card);
  });
}

/* ================= PLAYLIST ================= */

function addToPlaylist(trackId) {
  const song = allSongs.find(s => s.trackId === trackId);
  if (!song) return;

  if (!playlist.some(s => s.trackId === trackId)) {
    playlist.push(song);
    localStorage.setItem("playlist", JSON.stringify(playlist));
    renderPlaylist();
  }
}

function removeFromPlaylist(trackId) {
  playlist = playlist.filter(song => song.trackId !== trackId);
  localStorage.setItem("playlist", JSON.stringify(playlist));
  renderPlaylist();
}

function renderPlaylist() {
  const playDiv = document.getElementById("playlist");
  playDiv.innerHTML = "";

  if (!playlist.length) {
    playDiv.innerHTML = `<p class="empty">Playlist is empty 🎧</p>`;
    return;
  }

  playlist.forEach(song => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${song.trackName}</h3>
      ${song.previewUrl ? `<audio controls src="${song.previewUrl}"></audio>` : ""}
      <button class="remove-btn">❌ Remove</button>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromPlaylist(song.trackId);
    });

    playDiv.appendChild(card);
  });
}

/* ================= GENRE FILTER ================= */

function populateGenres(songs) {
  genreFilter.innerHTML = `<option value="">All Genres</option>`;

  const genres = songs
    .map(song => song.primaryGenreName)
    .filter(Boolean);

  [...new Set(genres)].forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

function applyFilter() {
  const selectedGenre = genreFilter.value;
  const filteredSongs = selectedGenre
    ? allSongs.filter(song => song.primaryGenreName === selectedGenre)
    : allSongs;

  displayResults(filteredSongs);
}

/* ================= THEME ================= */

function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* ================= INITIAL LOAD ================= */

renderFavorites();
renderPlaylist();
