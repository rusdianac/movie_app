import { useEffect, useState } from 'react'
import { Text, View, Pressable, StyleSheet, FlatList } from 'react-native'
import { useNavigation, StackActions } from '@react-navigation/native'
import { Category } from '../../types/app'
import { EXPO_API_ACCESS_TOKEN } from '../../constant'

export default function CategorySearch(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [genreId, setGenreId] = useState<number>()

  const navigation = useNavigation()
  const pushAction = StackActions.push('CategorySearchResult', {
    genreId: genreId,
    genreName: selectedCategory,
  })

  useEffect(() => {
    getCategories()
  }, [])

  const getCategories = (): void => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`
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
        setCategories(response.genres)
      })
      .catch((err) => console.error(err))
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <Pressable
            style={{
              ...styles.button,
              backgroundColor:
                item.name === selectedCategory ? '#8978A4' : '#C0B4D5',
            }}
            onPress={() => {
              setSelectedCategory(item.name)
              setGenreId(item.id)
            }}
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </Pressable>
        )}
        keyExtractor={(item) =>
          item.id !== undefined ? item.id.toString() : Math.random().toString()
        }
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
      />
      <Pressable
        style={styles.buttonSearch}
        onPress={() => {
          navigation.dispatch(pushAction)
        }}
      >
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  listContainer: {
    marginTop: 10,
  },
  columnWrapper: {
    marginBottom: 4,
  },
  button: {
    flex: 1,
    margin: 2,
    paddingVertical: 10,
    backgroundColor: '#C0B4D5',
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttonSearch: {
    backgroundColor: '#fefefe',
    borderRadius: 16,
    paddingVertical: 10,
    borderWidth: 1,
    marginTop: 4,
  },
})
