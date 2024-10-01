import React from 'react';

export default function SearchResults({ results, addToPlaylist }) {
  // const handleClick = (result) => {
  //   addToPlaylist(result);
  //   console.log({ result });
  // };
  return (
    <div>
      {results.map((result) => (
        <div key={result.id}>
          <img alt={result.name} src={result.album.images[0].url} width="100" />
          <h2> {result.name}</h2>
          <p>Song * {result.artists[0].name}</p>
          <button type="button" onClick={() => addToPlaylist(result)}>
            +
          </button>
        </div>
      ))}
    </div>
  );
}
