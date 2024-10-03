import React, { useState, useRef } from 'react';

export default function Playlist({ playlist, removeTrack, savePlaylist }) {
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);
  const addTitle = ({ target }) => {
    setTitle(target.value);
  };

  const handleClick = (trackId) => {
    return () => removeTrack(trackId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current.blur();
    }
  };

  const handleSavePlaylist = () => {
    savePlaylist(title);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add a title"
        value={title}
        onChange={addTitle}
        ref={inputRef}
        onKeyDown={handleKeyDown}
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
      <button type="button" onClick={handleSavePlaylist}>
        Add to Spotify
      </button>
    </div>
  );
}
