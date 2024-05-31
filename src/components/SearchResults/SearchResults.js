import React from "react";

import Tracklist from "../Tracklist/Tracklist";

function SearchResults(props) {
  return (
    <div>
      <h2>Results</h2>
      <Tracklist tracks={props.searchResults} onAdd={props.addTrack} />
    </div>
  );
}

export default SearchResults;
