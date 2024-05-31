let accessToken;

const Spotify = {
  getToken() {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;

    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/"); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  // query spotify for a song
  search(term) {
    const accessToken = Spotify.getToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          song: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris.length) {
      console.log(playlistName, trackUris);
      return;
    }

    const accessToken = Spotify.getToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    // fetch our user id -- required to access spotify playlist data for user
    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((r) => r.json())
      .then((user_r) =>
        // create new playlist for given user id
        fetch(`https://api.spotify.com/v1/users/${user_r.id}/playlists`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ name: playlistName }),
        })
          .then((r) => r.json())
          .then((r) =>
            // add tracks to new playlist with given playlist id
            fetch(
              `https://api.spotify.com/v1/users/${user_r.id}/playlists/${r.id}/tracks`,
              {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ uris: trackUris }),
              },
            ).then((r) => console.log(r.status)),
          ),
      );
  },
};

export default Spotify;
