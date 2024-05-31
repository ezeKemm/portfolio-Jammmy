import logo from "./logo.svg";
import React, { useState, useCallback } from "react";
import "./App.css";

import Spotify from "./Spotify.js";

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

const SearchBar = (props) => {
  // stores the value of our query in react state of the component
  const [term, setTerm] = useState("");
  // on updating the input field (adding/changing the query), the query stored in state must be updated

  const handleTermChange = useCallback((event) => {
    setTerm(event.target.value);
  }, []);

  // execute a search with the Spotify search method passed thru props
  const search = useCallback(() => {
    props.onSearch(term);
  }, [props.onSearch, term]);

  return (
    <div className="SearchBar">
      <input
        type="text"
        placeholder="Search Jammy"
        onChange={handleTermChange}
      />
      <button className="SearchButton" onClick={search}>
        Search
      </button>
    </div>
  );
};

function SearchResults(props) {
  return (
    <div>
      <h2>Results</h2>
      <Tracklist tracks={props.searchResults} onAdd={props.addTrack} />
    </div>
  );
}

function Playlist(props) {
  const handleNameChange = useCallback(
    (event) => {
      props.updateName(event.target.value);
    },
    [props.updateName],
  );

  return (
    <div>
      <input
        type="text"
        defaultValue="New Playlist"
        onChange={handleNameChange}
      />
      <Tracklist
        tracks={props.playlistTracks}
        onRemove={props.deleteTrack}
        isRemoval={true}
      />
      <button onClick={props.savePlaylist}>Save</button>
    </div>
  );
}

function Tracklist(props) {
  if (props.tracks) {
    return (
      <div>
        {props.tracks.map((track) => {
          return (
            <Track
              track={track}
              key={track.id}
              onAdd={props.onAdd}
              onRemove={props.onRemove}
              isRemoval={props.isRemoval}
            />
          );
        })}
      </div>
    );
  }
}

function Track(props) {
  const addTrack = useCallback(() => {
    props.onAdd(props.track);
  }, [props.onAdd, props.track]);

  const removeTrack = useCallback(() => {
    props.onRemove(props.track);
  }, [props.onRemove, props.track]);

  const renderButton = () => {
    if (props.isRemoval) {
      return <button onClick={removeTrack}>-</button>;
    }
    return <button onClick={addTrack}>+</button>;
  };

  return (
    <div>
      <h4>{props.track.song}</h4>
      <p>
        {props.track.artist} | {props.track.album}
      </p>
      {renderButton()}
    </div>
  );
}

export default App;
