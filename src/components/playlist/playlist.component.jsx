import React from 'react';

export default function Playlist({ playlist }) {
  console.log(playlist);
  return (
    <div>
      <h2>Your Playlist</h2>
      {playlist.map((track) => (
        <div key={track.id}>
          <img alt={track.name} src={track.album.images[0].url} width="50" />
          <p>{track.name}</p>
          <p>{track.artists[0].name}</p>
        </div>
      ))}
    </div>
  );
}
