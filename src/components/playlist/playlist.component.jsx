import React, { useState, useRef } from 'react';
import './Playlist.css';

export default function Playlist({ playlist, removeTrack, savePlaylist }) {
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  const addTitle = ({ target }) => {
    if (target.value.length === 0) {
      setTitle(target.value);
    } else {
      setTitle(target.value[0].toUpperCase() + target.value.slice(1));
    }
  };

  const handleClick = (trackId) => {
    return () => removeTrack(trackId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current.blur();
    }
  };

  const handleFocus = () => {
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }
    }, 0);
  };

  const handleSavePlaylist = () => {
    savePlaylist(title, () => {
      setTitle('');
    });
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
        onFocus={handleFocus}
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
