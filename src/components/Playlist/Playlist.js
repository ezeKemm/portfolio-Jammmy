import React, { useCallback } from "react";

import Tracklist from "../Tracklist/Tracklist.js";

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

export default Playlist;
