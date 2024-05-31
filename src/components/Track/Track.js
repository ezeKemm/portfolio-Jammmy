import React, { useCallback } from "react";

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

export default Track;
