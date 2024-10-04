import { useEffect, useState, useCallback } from 'react';
import './App.css';
import Playlist from './components/playlist/playlist.component';
import SearchBar from './components/search-bar/search-bar.component';
import TrackList from './components/tracklist/tracklist.component';
import Header from './components/header/Header.component';

function App() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [searchResults, setSearcResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

  const redirectToSpotify = useCallback(() => {
    const scope = 'user-read-private user-read-email playlist-modify-public';
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  }, [clientId, redirectUri]);

  const fetchUserId = useCallback(
    async (accessToken) => {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('spotify_token');
        redirectToSpotify();
        return;
      }
      if (!response.ok) {
        console.error('Failed to fetch user ID', response.statusText);
        return;
      }
      const data = await response.json();
      setUserId(data.id);
    },
    [redirectToSpotify],
  );

  useEffect(() => {
    const hash = window.location.hash;
    let token = localStorage.getItem('spotify_token');

    if (hash) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const urlToken = params.get('access_token');

      if (urlToken) {
        token = urlToken;
        window.location.hash = '';
        localStorage.setItem('spotify_token', token);
      }
    }
    if (token) {
      setToken(token);
      fetchUserId(token);
    } else {
      redirectToSpotify();
    }
  }, [fetchUserId, redirectToSpotify]);

  const searchSpotify = async (query) => {
    if (!token) {
      console.error('No access token available');
      return;
    }
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      console.error('Failed to search tracks', response.statusText);
      return;
    }
    const data = await response.json();
    setSearcResults(data.tracks.items);
  };

  const savePlaylist = async (playlistTitle) => {
    if (playlistTitle) {
      try {
        // create a playlist
        const response = await fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: playlistTitle,
              public: true,
            }),
          },
        );
        const playlistData = await response.json();
        const tracksUris = playlist.map((track) => track.uri);

        //add tracks to playlist
        await fetch(
          `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uris: tracksUris,
            }),
          },
        );
        setPlaylist([]);
      } catch (error) {
        console.error('Error saving playlist', error);
      }
    } else {
      alert('Please add a tittle.');
    }
  };

  const addToPlaylist = (track) => {
    setPlaylist((prev) =>
      prev.find((prevTrack) => prevTrack.id === track.id)
        ? prev
        : [...prev, track],
    );
  };

  const removeFromPlaylist = (trackId) => {
    setPlaylist((prev) => prev.filter((prevTrack) => prevTrack.id !== trackId));
  };

  return (
    <div className="App">
      <Header />
      <div className="main__container">
        <div className="search__container">
          <SearchBar onSearch={searchSpotify} resetSearch={setSearcResults} />
          <TrackList results={searchResults} addToPlaylist={addToPlaylist} />
        </div>
        <Playlist
          playlist={playlist}
          removeTrack={removeFromPlaylist}
          savePlaylist={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;
