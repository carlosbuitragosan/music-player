import React from 'react';
import './Track.css';

export default function Track({ track, addToPlaylist }) {
  return (
    <div className="track__container">
      <img
        className="track__img"
        alt={track.name}
        src={track.album.images[0].url}
      />
      <div className="track__info">
        <p className="track__title"> {track.name}</p>
        <p className="track__name">Song • {track.artists[0].name}</p>
      </div>
      <button
        className="track__button"
        type="button"
        onClick={() => addToPlaylist(track)}
      >
        +
      </button>
    </div>
  );
}
