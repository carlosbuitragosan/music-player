import { useEffect, useState } from 'react';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Playlist from './components/playlist/playlist.component';
import SearchBar from './components/search-bar/search-bar.component';
import TrackList from './components/tracklist/tracklist.component';
import Header from './components/header/Header.component';
import {
  redirectToSpotify,
  fetchUserId,
  searchSpotify,
  savePlaylist,
} from './spotify/spotifyService';

function App() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [searchResults, setSearcResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);

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
      (async () => {
        const userId = await fetchUserId(token);
        setUserId(userId);
      })();
    }
  }, []);

  const handleSearch = async (query) => {
    if (!token) {
      redirectToSpotify();
      return;
    }
    const results = await searchSpotify(query, token);
    setSearcResults(results);
  };

  const handleSavePlaylist = async (playlistTitle, onSuccess) => {
    try {
      await savePlaylist(playlistTitle, playlist, token, userId);
      setPlaylist([]);
      if (onSuccess) {
        onSuccess();
      }
      toast.success('Playlist saved.');
    } catch (error) {
      toast.error(error.message);
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
          <SearchBar onSearch={handleSearch} resetSearch={setSearcResults} />
          <TrackList results={searchResults} addToPlaylist={addToPlaylist} />
        </div>
        <Playlist
          playlist={playlist}
          removeTrack={removeFromPlaylist}
          savePlaylist={handleSavePlaylist}
        />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Zoom}
      />
    </div>
  );
}

export default App;
