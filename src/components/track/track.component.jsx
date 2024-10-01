import React from 'react';

export default function Track({ track, addToPlaylist }) {
  return (
    <div>
      <img alt={track.name} src={track.album.images[0].url} width="100" />
      <h2> {track.name}</h2>
      <p>Song * {track.artists[0].name}</p>
      <button type="button" onClick={() => addToPlaylist(track)}>
        +
      </button>
    </div>
  );
}
