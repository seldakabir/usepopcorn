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
  const [watched, setWached] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
 
  function handleId(id) {
  setSelectedId(selectedId=>selectedId===id?null:id)
  }
  function handleNullId() {
    setSelectedId(null)
  }
  function handleAddWatchedMovies(movie) {
    setWached(watched=>[...watched,movie])
  }
  function handleDeleteWatched(imdbID) {
  setWached(watched=>watched.filter(watch=>watch.imdbID!==imdbID))
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
      
      }
      catch(err) {
       
        setErrorMessage(err.message)
      }
      finally {
              setIsLoading(false)

      }
      console.log(watched);
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
        {selectedId ? <MovieDetails id={selectedId}
          watched={watched}
          onHanldeId={handleId}
          handleNullId={handleNullId}
          onAddWatchedMovie={handleAddWatchedMovies} 
          
          /> :

          <>
        <Summery data={watched} />
            <Watched
              data={watched}
              onDeleteWatched={handleDeleteWatched} />
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
  return <p className="num-results">
    Found {data ? data.length : 0} results</p>
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
function MovieDetails({ id, handleNullId,onAddWatchedMovie,watched }) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsloading] = useState(false)
  const [isError, setError] = useState('')
  const [userRating, setUserRating] = useState('')

  const isWatched = watched.map(watch => watch.imdbID).includes(id)
  console.log(isWatched);
  const watchedUserRating = watched.find(
    watch => watch.imdbID === id
  )?.userRating
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actores: actors,
    Director: director,
    Genr: genre
  } = movie
  function handleAdd() {

    const newMovie = {
      imdbID: id,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      genre
}


    onAddWatchedMovie(newMovie)
    handleNullId()
  }
  useEffect(function () {
    async function getMoviesDetails() {
      setIsloading(true)
      setError('')
      try {
        const res = await fetch(
        `http://www.omdbapi.com/?apikey=${key}&i=${id}`)
if(!res.ok) throw new Error('there is an error')
      const data = await res.json()
      setMovie(data)
      setIsloading(false)
      }
      catch (err) {
        setError(err.message);
      }
      
      
    }
    getMoviesDetails()
  }, [id])
  return  <div className="details"  >
   { isLoading && <Loading />}
  {isError && <Message/>}
    {!isLoading && !isError &&
   <> <header>
      <button className="btn-back"
        onClick={handleNullId}>&larr;</button>
      <img src={poster} alt={movie.poster}></img>
      <div className="details-overview">
        <h2>{title}</h2>
        <p>
          {released} &bull; {runtime}
        </p>
        <p>{genre}</p>
        <p><span>⭐️</span>
          {imdbRating} IMDb rating
        </p>
      </div>
    </header>
      <section>
        <div className="rating">
          {!isWatched ?(
            <>
              <StarRating
                onUserRating={setUserRating} 
                />
              {userRating > 0 && (
                <button className="btn-add " onClick=
                  {handleAdd} >+ Add to list
                  
                </button>
              )}
            </>
          ):
            <p>You rated this movie before {watchedUserRating }<span> ⭐️</span></p>
          }
           </div>
      <p><em>{plot}</em></p>
      <p>Starring {actors}</p>
      <p>Directed by<b> {director}</b></p>
      
      </section>
      </>
   }
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
function Watched({ data,onDeleteWatched }) {
  
  return <ul className="list">
       {data.map(movie =>(
      <li>
        <img src={movie.poster} alt={movie.poster}></img>
        <h3>{movie.Title}</h3>
        <div>
          <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating.toFixed(2)}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating.toFixed(2)}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
             </p>
             <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imdbID)}></button>
        </div>
      </li>
   ))} 
      </ul>
}

function StarRating({onUserRating}) {
  const [rating, setRating] = useState(0)
  const [tempRating, setTempRating] = useState(0)
  function handleSetRating(rating) {
setRating(rating)
    onUserRating(rating)
  }
 
  return<div style={container}>
  <div style={starContainer}>
    {
        Array.from({ length: 10 }, (_, i) => <Star key={i + 1}
          onClick={()=>handleSetRating(i+1)}
          onHover={() => setTempRating(i + 1)}
           onLeave={()=>setTempRating(0)}
          full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
          onHandleSetRating={handleSetRating}
        />)
    }
    </div>
    <p>{tempRating || rating ||''}</p>
    </div>
}
const starStyle = {
  width: '24px',
  height: '24px',
  display: 'flex',
 
}
const starContainer = {
  display: 'flex',
  justifyContent: ' center',
  alignItems: 'center',
  
}
const container = {
  display: 'flex',
  justifyContent: ' center',
  alignItems: 'center',
    gap:'2rem'
}


function Star({onClick,full,onHover}) {
  return <span style={starStyle} onClick={onClick} onMouseEnter={onHover} >
    {full?<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="#fbf204"
  stroke="#fbf204"
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>:<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="#fbf204"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>
}
  </span>
}