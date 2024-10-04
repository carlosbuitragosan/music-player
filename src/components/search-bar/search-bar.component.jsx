import React, { useState, useRef } from 'react';
import './search-bar.css';

export default function SearchBar({ onSearch, resetSearch }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const handleChange = ({ target }) => {
    const query = target.value;
    setQuery(query);
    if (query) {
      onSearch(query);
    } else {
      resetSearch([]);
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current.blur();
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
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
    </form>
  );
}
