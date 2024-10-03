import { useEffect, useState } from 'react';
import './App.css';
import Playlist from './components/playlist/playlist.component';
import SearchBar from './components/search-bar/search-bar.component';
import TrackList from './components/tracklist/tracklist.component';

function App() {
  const [token, setToken] = useState('');
  const [searchResults, setSearcResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [userId, setUserId] = useState('');

  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

  useEffect(() => {
    const hash = window.location.hash;
    let token = localStorage.getItem('spotify_token');

    if (!token && hash) {
      const params = new URLSearchParams(hash.replace('#', ''));
      token = params.get('access_token');

      if (token) {
        window.location.hash = '';
        localStorage.setItem('spotify_token', token);
        setToken(token);
        fetchUserId(token);
      } else {
        console.error('No access token found in URL');
      }
    } else if (token) {
      setToken(token);
      fetchUserId(token);
    }
    if (!token) {
      redirectToSpotify();
    }
  }, []);

  const redirectToSpotify = () => {
    const scope = 'user-read-private user-read-email playlist-modify-public';
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  };

  const savePlaylist = async (playlistTitle) => {
    try {
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
    } catch (error) {
      console.error('Error saving playlist', error);
    }
  };

  const fetchUserId = async (accessToken) => {
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
  };

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

  const addToPlaylist = (track) => {
    setPlaylist((prev) =>
      prev.find((prevTrack) => prevTrack.id === track.id)
        ? prev
        : [track, ...prev],
    );
  };

  const removeFromPlaylist = (trackId) => {
    setPlaylist((prev) => prev.filter((prevTrack) => prevTrack.id !== trackId));
  };

  return (
    <div className="App">
      <SearchBar onSearch={searchSpotify} resetSearch={setSearcResults} />
      <TrackList results={searchResults} addToPlaylist={addToPlaylist} />
      <Playlist
        playlist={playlist}
        removeTrack={removeFromPlaylist}
        savePlaylist={savePlaylist}
      />
    </div>
  );
}

export default App;
