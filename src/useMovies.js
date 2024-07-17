import { useEffect,useState } from "react"
 const key='8c7bd93c'
export function useMovies(query) {
   
const [movies, setMovies] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
    useEffect(function () {
        const controller = new AbortController()
        async function fetchMovies() {
            try {
                setIsLoading(true)
                setErrorMessage('')
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${key}&s=${query}`
                    , { signal: controller.signal })
                if (!res.ok)
                    throw new Error('there is a problem in connection')

                const data = await res.json()
                if (data.response === false)
                    throw new Error('Movie is not Found')
          
                setMovies(data.Search)
                return function () {
                    controller.abort()
                }
      
            }
            catch (err) {
                if (err.name !== 'AbortError') {
                    setErrorMessage(err.message)

                }
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
    }, [query]);
return {movies,errorMessage,isLoading}
}