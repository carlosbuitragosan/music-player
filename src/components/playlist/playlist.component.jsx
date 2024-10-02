import React from 'react';

export default function Playlist({ playlist, removeTrack }) {
  const handleClick = (trackId) => {
    return () => removeTrack(trackId);
  };

  return (
    <div>
      <h2>Your Playlist</h2>
      {playlist.map((track) => (
        <div key={track.id}>
          <img alt={track.name} src={track.album.images[0].url} width="50" />
          <p>{track.name}</p>
          <p>{track.artists[0].name}</p>
          <button type="button" onClick={handleClick(track.id)}>
            -
          </button>
        </div>
      ))}
    </div>
  );
}
