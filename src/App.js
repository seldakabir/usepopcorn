import { useEffect, useState } from "react";


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
const key='8c7bd93c'
export default function App() {
  const [movies, setMovies] = useState(tempMovieData)
  const [watched, setWached] = useState(tempWatchedData)
  useEffect(function () {
    fetch(`http://www.omdbapi.com/?apikey=${key}&s=Titanic`)
      .then(res => res.json())
    .then(data=>console.log(data.Search))
  })


  return <div>
    <Nav> 
      <Logo />
      <Search data={movies } />
      <Result data={movies } />  
    </Nav>
    <Main >
      <Box data={movies}><MovieList data={movies } /></Box>
      <Box data={watched}> <Summery data={watched}/> <Watched data={watched} /></Box>
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
function Search({ data }) {
  const [query,setQuery]=useState('')

  return <div>
    <input type="text" placeholder="search a movie" className="search" value={query} onChange={e=>setQuery(e.target.value)} />
  </div>
}

function Result({data}) {
  return <p className="num-results">Found {data.length} results</p>
}

function Main({children}) {
  return <div className="main">{ children}</div>
}

function Box({data,children}) {
  const [isOpen, setIsOpen] = useState(true)
  function handleOpen() {
    setIsOpen(open=>!open)
  }
  return <div className="box">
    <button className="btn-toggle" onClick={handleOpen}> {isOpen ? '-' : '+'} </button>
        
  {isOpen && children}
    </div>
}
function MovieList({data}) {
  return <ul className="list">
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
    </ul>
}
const average=(arr)=> 
 arr.reduce((acc,cur,i,arr)=>acc+cur/arr.length,0)


  

function Summery({ data }) {
    const avgImdbRating = average(data.map(movie => movie.imdbRating))
  const avgUserRating = average(data.map(movie => movie.userRating))
  const avgRuntime = average(data.map((movie) => movie.runtime));
  return <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
            <span>#️⃣ { data.length}</span>
          <span> movies</span>
        </p>
        <p>
          <span>⭐️</span>
            <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
            <span>{ avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
      
      </div>
}
function Watched({ data }) {
  
  return <ul className="list">
       {data.map(movie =>(
      <li>
        <img src={movie.Poster} alt={movie.Poster}></img>
        <h3>{movie.Title}</h3>
        <div>
          <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
                      </p>
        </div>
      </li>
   ))} 
      </ul>
}