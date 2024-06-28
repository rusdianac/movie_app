import { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { EXPO_API_ACCESS_TOKEN } from '../constant'
import { Movie } from '../types/app'
import MovieItem from '../components/movies/MovieItem'

const coverImageSize = {
  poster: {
    width: 100,
    height: 160,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CategorySearchResult({ route }: any): JSX.Element {
  const { genreId, genreName } = route.params
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    getMovieByGenre(genreId)
  }, [])

  const getMovieByGenre = (genreId: number): void => {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${EXPO_API_ACCESS_TOKEN}`,
      },
    }
    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovies(response.results)
      })
      .catch((err) => console.error(err))
  }
  return (
    <View>
      <Text style={styles.title}>Result of {genreName} Genre</Text>
      {/* list of movies */}
      <FlatList
        style={styles.movieList}
        showsVerticalScrollIndicator={true}
        data={movies}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            size={coverImageSize['poster']}
            coverType="poster"
          />
        )}
        keyExtractor={(item) =>
          item.id !== undefined ? item.id.toString() : Math.random().toString()
        }
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 14,
  },
  movieList: {
    paddingLeft: 4,
  },
  listContainer: {
    paddingBottom: 80,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnWrapper: {
    gap: 4,
  },
})
