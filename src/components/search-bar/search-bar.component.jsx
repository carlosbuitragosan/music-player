import React, { useState } from 'react';

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
    <form>
      <input
        type="text"
        value={query}
        placeholder="What do you want to listen"
        onChange={handleChange}
      />
    </form>
  );
}
