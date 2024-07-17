import { useEffect, useRef, useState } from "react";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocallStorage";
import { useKey } from "./useKey";
 const key='8c7bd93c'

export default function App() {
  
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  
  function handleId(id) {
    setSelectedId(selectedId => selectedId === id ? null : id)
  }
  function handleNullId() {
    setSelectedId(null)
  }
  function handleAddWatchedMovies(movie) {
    setWached(watched => [...watched, movie])
  }
  function handleDeleteWatched(imdbID) {
    setWached(watched => watched.filter(watch => watch.imdbID !== imdbID))
  }
  const { movies, isLoading, errorMessage } = useMovies(query)

  const  [watched,setWached]=useLocalStorage([],'watched')



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

  const elInput = useRef('')
  useEffect(function () {
    function callback(e) {
      if (document.activeElement === elInput.current) return;
      if (e.code === 'Enter') {
        elInput.current.focus();
        setQuery('')
    
  }
}

    document.addEventListener('keydown', callback)
    return ()=> document.removeEventListener('keydown', callback)
},[setQuery])

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
 useKey('Escape',handleNullId)
  useEffect(function () {
    const controller= new AbortController()
    async function getMoviesDetails() {
      setIsloading(true)
      setError('')
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${id}`,
          {signal:controller.signal}
          )
if(!res.ok) throw new Error('there is an error')
      const data = await res.json()
      setMovie(data)
      setIsloading(false)
      }
      catch (err) {
         if (err.name !== 'AbortError') {
                 setError(err.message)

       }
      }
      
      
    }
    
    getMoviesDetails()
  }, [id])
  useEffect(function () {
    if (!title) return;
    document.title = `Movie |${title}`
    return function () {
      document.title='Popcorn'
    }
  },[title])
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