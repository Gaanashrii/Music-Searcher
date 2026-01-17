const resultsDiv = document.getElementById("results");

async function searchMusic() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    alert("Please enter a search term");
    return;
  }

  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=20`
    );
    const data = await response.json();

    displayResults(data.results);
  } catch (error) {
    resultsDiv.innerHTML = "<p>Error fetching music 😢</p>";
  }
}

function displayResults(songs) {
  resultsDiv.innerHTML = "";

  if (songs.length === 0) {
    resultsDiv.innerHTML = "<p>No results found 🎧</p>";
    return;
  }

  songs.forEach(song => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${song.artworkUrl100}" alt="Album Art">
      <h3>${song.trackName || "Unknown Track"}</h3>
      <p><strong>Artist:</strong> ${song.artistName}</p>
      <p><strong>Genre:</strong> ${song.primaryGenreName || "N/A"}</p>
      ${song.previewUrl ? `<audio controls src="${song.previewUrl}"></audio>` : ""}
    `;

    resultsDiv.appendChild(card);
  });
}
