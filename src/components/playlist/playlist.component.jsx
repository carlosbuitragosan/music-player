import React, { useState, useRef } from 'react';
import './Playlist.css';

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
    <div className="playlist__container">
      <input
        className="playlist__title"
        type="text"
        placeholder="Add a title"
        value={title}
        onChange={addTitle}
        ref={inputRef}
        onKeyDown={handleKeyDown}
      />
      {playlist.map((track) => (
        <div key={track.id} className="playlist__tack_container">
          <div className="playlist__track_info">
            <p className="playlist__track_name">{track.name}</p>
            <p className="playlist__track_artist">{track.artists[0].name}</p>
          </div>
          <button
            className="playlist__track_remove-button"
            type="button"
            onClick={handleClick(track.id)}
          >
            -
          </button>
        </div>
      ))}
      <button
        className="addPlaylist__button"
        type="button"
        onClick={handleSavePlaylist}
      >
        Add to Spotify
      </button>
    </div>
  );
}
