import React from 'react';
import Track from '../track/track.component';

export default function TrackList({ results, addToPlaylist }) {
  return (
    <div>
      {results.map((result) => (
        <Track key={result.id} track={result} addToPlaylist={addToPlaylist} />
      ))}
    </div>
  );
}
