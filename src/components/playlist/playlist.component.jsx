import React, { useState } from 'react';

export default function Playlist({ playlist, removeTrack }) {
  const [title, setTitle] = useState('');

  const addTitle = ({ target }) => {
    setTitle(target.value);
  };
  const handleClick = (trackId) => {
    return () => removeTrack(trackId);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add a title"
        value={title}
        onChange={addTitle}
      />
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
