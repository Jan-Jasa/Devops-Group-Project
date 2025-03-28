import React, { useState } from 'react';

const MOVIES = [
  { id: 1, title: 'The Shawshank Redemption' },
  { id: 2, title: 'The Godfather' },
  { id: 3, title: 'The Dark Knight' },
  { id: 4, title: 'Pulp Fiction' },
  { id: 5, title: 'Forrest Gump' },
  { id: 6, title: 'Inception' },
  { id: 7, title: 'The Matrix' },
  { id: 8, title: 'Interstellar' }
];

const MovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  const handleSearch = () => {
    // (case-insensitive)
    const results = MOVIES.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(results);
  };

  return (
      <div>
        <h1>Recent Best Flicks!</h1>

        <div>
          <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter movie title"
          />
          <button
              onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {filteredMovies.length > 0 ? (
            <ul>
              {filteredMovies.map(movie => (
                  <li
                      key={movie.id}
                  >
                    <span>{movie.title}</span>
                    <button>
                      Details
                    </button>
                  </li>
              ))}
            </ul>
        ) : (
            <p>
              {searchTerm ? 'No movies found' : 'Enter a movie title to search'}
            </p>
        )}
      </div>
  );
};

export default MovieSearch;