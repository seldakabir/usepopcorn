import { useState } from "react";


const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export default function App() {
  const [movies, setMovies] = useState(tempMovieData)
  const [watched,setWached]=useState(tempWatchedData)
  return <div>
    <Nav> 
      <Logo />
      <Search />
     <Result/>  
    </Nav>
    <Main >
      <Box data={movies}></Box>
      <Box data={watched}></Box>
    </Main>
  </div>
}

function Nav({children}) {
  return <div className="nav-bar">{ children}</div>
}
function Logo() {
  return <div className="logo">
    <img src="popcorn.jpeg" alt="popcorn.jpeg"></img>
   <span>UsePopcorn</span> 
  </div>
}
function Search() {
  return <div>
    <input type="text" placeholder="search a movie"className="search"/>
  </div>
}

function Result() {
  return <p className="num-results">Found X results</p>
}

function Main({children}) {
  return <div className="main">{ children}</div>
}

function Box({data}) {
  const [isOpen, setIsOpen] = useState(true)
  function handleOpen() {
    setIsOpen(open=>!open)
  }
  return <div className="box">
    <button className="btn-toggle" onClick={handleOpen}> {isOpen? '-':'+'} </button>
  {isOpen && <ul className="list">
    {data.map(movie =>(
      <li>
        <img src={movie.Poster} alt={movie.Poster}></img>
        <h3>{movie.Title}</h3>
        <div>
          <p>🗓️</p>
          <p>{ movie.Year}</p>
        </div>
      </li>
   ))}
    </ul>}
    </div>
}