import { API_ACCESS_TOKEN } from '@env'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Movie } from '../types/app'
import { LinearGradient } from 'expo-linear-gradient'
import MovieList from '../components/movies/MovieList'
import AsyncStorage from '@react-native-async-storage/async-storage'

const MovieDetail = ({ route }: any): JSX.Element => {
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const { id } = route.params

  useEffect(() => {
    getMovieDetail()
    checkIsFavorite(id).then(setIsFavorite)
  }, [id])

  const getMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setDetailMovie(response)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  const checkIsFavorite = async (id: number): Promise<boolean> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData)
        return favMovieList.some((movie) => movie.id === id)
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    }
  }

  if (!detailMovie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      let favMovieList: Movie[] = []

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie]
      } else {
        favMovieList = [movie]
      }

      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))

      setIsFavorite(true)
    } catch (error) {
      console.log(error)
    }
  }

  const removeFavorite = async (movieId: number): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData)
        const updatedFavMovieList = favMovieList.filter(
          (movie) => movie.id !== movieId,
        )

        await AsyncStorage.setItem(
          '@FavoriteList',
          JSON.stringify(updatedFavMovieList),
        )

        setIsFavorite(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${detailMovie.backdrop_path}`,
        }}
        style={styles.poster}
      >
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          locations={[0.6, 0.8]}
          style={styles.gradientStyle}
        >
          <Text style={styles.movieTitle}>{detailMovie.title}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="yellow" />
            <Text style={styles.rating}>
              {detailMovie.vote_average.toFixed(1)}
            </Text>
          </View>
          <View style={styles.favoriteContainer}>
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={24}
              color="pink"
              onPress={() => {
                if (isFavorite) {
                  removeFavorite(detailMovie.id)
                } else {
                  addFavorite(detailMovie)
                }
              }}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
      <Text style={styles.overview}>{detailMovie.overview}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.gridItemText}>Original Language</Text>
          <Text style={{ color: '#FFFFFF' }}>
            {detailMovie.original_language}
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridItemText}>Popularity</Text>
          <Text style={{ color: '#FFFFFF' }}>{detailMovie.popularity}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridItemText}>Release date</Text>
          <Text style={{ color: '#FFFFFF' }}>
            {new Date(detailMovie.release_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              weekday: 'short',
            })}
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridItemText}>Vote Count</Text>
          <Text style={{ color: '#FFFFFF' }}>{detailMovie.vote_count}</Text>
        </View>
      </View>
      <View>
        <MovieList
          title="Recommendations"
          path={`/movie/${id}/recommendations?language=en-US&page=1`}
          coverType="poster"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#141414',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  poster: {
    width: '100%',
    height: 300,
  },
  overview: {
    fontSize: 16,
    color: '#E5E5E5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 18,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
    fontSize: 14,
  },
  movieTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  gradientStyle: {
    padding: 20,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  gridItem: {
    width: '40%',
    paddingTop: 5,
  },
  gridItemText: {
    fontWeight: '700',
    color: '#E5E5E5',
  },
  favoriteContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    color: '#E5E5E5',
  },
})

export default MovieDetail
