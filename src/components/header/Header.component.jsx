import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <h1>Music Playlist</h1>
      <p className="header__description">
        Create a playlist and add to your Spotify account
      </p>
    </header>
  );
}
