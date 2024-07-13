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
  const [movies, setMovies] = useState([])
  const [watched, setWached] = useState(tempWatchedData)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [query, setQuery] = useState('')
  const[selectedId,setSelectedId]=useState(null)
  function handleId(id) {
  setSelectedId(selectedId=>selectedId===id?null:id)
  }
  function handleNullId() {
    setSelectedId(null)
  }

  useEffect( function () {
    async function fetchMovies() {
      try {
        setIsLoading(true)
        setErrorMessage('')
         const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`)
        if (!res.ok)
          throw new Error('there is a problem in connection')

        const data = await res.json()
        if (data.response===false) 
           throw new Error('Movie is not Found')
          
        setMovies(data.Search)
        console.log(data.Search);
      }
      catch(err) {
       
        setErrorMessage(err.message)
      }
      finally {
              setIsLoading(false)

      }
      
    }
    if (query.length < 3) {
      setErrorMessage('')
      setMovies([])
      return;
    }

    fetchMovies()
  },[query])


  return <>
    <Nav> 
      <Logo />
      <Search  query={query} setQuery={setQuery} />
      <Result data={movies } />  
    </Nav>
    <Main >
      <Box data={movies}>
        {isLoading && <Loading />}
        {!isLoading && !errorMessage && (<MovieList data={movies} id={selectedId } onHandleId={handleId } /> ) }

        {errorMessage && <Message message={errorMessage} />}
      </Box>
      <Box data={watched}>
        {selectedId ? <MovieDetails id={selectedId} onHanldeId={handleId} handleNullId={handleNullId} /> :

          <>
        <Summery data={watched} />
            <Watched data={watched} />
          </>
        }
      </Box>
    </Main>
  </>
}
function Message({message}) {
  return <div className="error">
    <span>⛔️</span>{message}
  </div>
}
function Loading() {
  return <div className="loader">Loading...</div>
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
function Search({query,setQuery}) {


  return  <input type="text"
      placeholder="search a movie"
      className="search"
      value={query}
      onChange={e => setQuery(e.target.value)} />
  
}

function Result({data}) {
  return <p className="num-results">Found {data? data.length:0} results</p>
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
function MovieList({data,id,onHandleId}) {
  return <ul className="list list-movies ">
    {data && data.map(movie =>(
      <li onClick={()=>onHandleId(movie.imdbID)}>
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
function MovieDetails({id,handleNullId}) {
  return <div className="details"  >
    <button className="btn-back" onClick={handleNullId}>&larr;</button>
     <section>
      <img></img>
      <div className="details-overview">
        <h2></h2>
        <p>
         <span></span> 
         <span></span> 
         <span></span> 
        </p>
      </div>
    </section>
   

   
  </div>
}



const average=(arr)=> 
 arr.reduce((acc,cur,i,arr)=>acc+cur/arr.length,0)


  

function Summery({ data }) {
    const avgImdbRating = average(data&&data.map(movie => movie.imdbRating))
  const avgUserRating = average(data&&data.map(movie => movie.userRating))
  const avgRuntime = average(data&&data.map((movie) => movie.runtime));
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