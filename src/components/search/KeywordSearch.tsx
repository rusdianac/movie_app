/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'
import { View, TextInput, StyleSheet, FlatList } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { EXPO_API_ACCESS_TOKEN } from '../../constant'
import { Movie } from '../../types/app'
import MovieItem from '../movies/MovieItem'

const coverImageSize = {
  poster: {
    width: 100,
    height: 160,
  },
}

export default function KeywordSearch(): JSX.Element {
  const [keyword, setKeyword] = useState<string>('')
  const [movies, setMovies] = useState<Movie[]>([])

  const getMovieByKeyword = (keyword: string): void => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}`
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
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Input movie's title here"
          onChangeText={setKeyword}
          onSubmitEditing={() => {
            getMovieByKeyword(keyword)
          }}
          defaultValue={keyword}
        />
        <FontAwesome
          name="search"
          size={20}
          color="#5e5e5e"
          style={styles.icon}
        />
      </View>
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
  input: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#e7e7e7',
    height: 50,
  },
  container: {
    marginTop: 10,
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    right: 20,
  },
  movieList: {
    paddingLeft: 4,
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 360,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnWrapper: {
    gap: 4,
  },
})
