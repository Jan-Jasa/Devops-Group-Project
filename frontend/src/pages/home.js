import React, {useState} from 'react';


function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const placeHolder = 'https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U';

  // sample movies
  const movies = [
    { id: 1, title: 'Inception', image: placeHolder },
    { id: 2, title: 'Interstellar', image: placeHolder },
    { id: 3, title: 'The Dark Knight', image: placeHolder },
    { id: 4, title: 'The Matrix', image: placeHolder },
      { id: 5, title: 'The Gabe', image: placeHolder },
  ];

  // Search Filter 
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container'>
      <div className='main-content'>
        <h1>Movies</h1>
        <div className='searchBar'>
            <label>Search</label>
            <input type='text' value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search movies..."
            />
        </div>
        <div className='moviesContainer'>
        {filteredMovies.map(movie => (
            <div key={movie.id} className="movieTile">
              <img src={movie.image} alt={movie.title} />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
