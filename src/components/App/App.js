import React, { useState, useCallback } from "react";
import "./App.css";

import Spotify from "../../Spotify.js";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults.js";
import Playlist from "../Playlist/Playlist.js";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");

  const search = useCallback((term) => {
    Spotify.search(term).then(setSearchResults);
  }, []);

  const updateName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  const deleteTrack = useCallback((track) => {
    setPlaylistTracks((prev) =>
      prev.filter((currTrack) => currTrack.id !== track.id),
    );
  }, []);

  const addTrack = useCallback(
    (track) => {
      setPlaylistTracks((prev) => [...prev, track]);
    },
    [playlistTracks],
  );

  const savePlaylist = useCallback(() => {
    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  }, [playlistName, playlistTracks]);

  return (
    <div className="App">
      <h1>Jammmy</h1>
      <div className="Search">
        <SearchBar onSearch={search} />
      </div>
      <div>
        <SearchResults searchResults={searchResults} addTrack={addTrack} />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          savePlaylist={savePlaylist}
          updateName={updateName}
          deleteTrack={deleteTrack}
        />
      </div>
    </div>
  );
}

export default App;
