import React from "react";

import Track from "../Track/Track";

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

export default Tracklist;
