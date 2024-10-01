import { useEffect, useState } from 'react';
import './App.css';
import Playlist from './components/playlist/playlist.component';
import SearchBar from './components/search-bar/search-bar.component';
import SearchResults from './components/search-results/search-results.component';
import Track from './components/track/track.component';
import TrackList from './components/tracklist/tracklist.component';

function App() {
  const [token, setToken] = useState('');
  const [searchResults, setSearcResults] = useState([]);

  useEffect(() => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

    const getToken = async () => {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      });
      const data = await response.json();
      setToken(data.access_token);
    };
    getToken();
  }, []);

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

    const data = await response.json();
    setSearcResults(data.tracks.items);
  };

  return (
    <div className="App">
      <SearchBar onSearch={searchSpotify} />
      <SearchResults results={searchResults} />
      <Playlist />
      <Track />
      <TrackList />
    </div>
  );
}

export default App;
