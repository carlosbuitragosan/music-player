import React, { useState } from 'react';
import './search-bar.css';

export default function SearchBar({ onSearch, resetSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = ({ target }) => {
    const query = target.value;
    setQuery(query);
    if (query) {
      onSearch(query);
    } else {
      resetSearch([]);
    }
  };

  return (
    <form className="searchbar">
      <input
        className="searchbar__input"
        type="text"
        value={query}
        placeholder="Search Spotify"
        onChange={handleChange}
      />
    </form>
  );
}
