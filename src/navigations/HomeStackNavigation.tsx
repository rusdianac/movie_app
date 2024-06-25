import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import Search from '../screens/Search'
import Favorite from '../screens/Favorite'
import MovieDetail from '../screens/MovieDetail'

const Stack = createNativeStackNavigator()

const HomeStackNavigator = (): JSX.Element => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Search"
      component={Search}
      options={{ title: 'Search' }}
    />
    <Stack.Screen
      name="Favorite"
      component={Favorite}
      options={{ title: 'Favorite' }}
    />
    <Stack.Screen
      name="MovieDetail"
      component={MovieDetail}
      options={{ title: 'Movie Detail' }}
    />
  </Stack.Navigator>
)

export default HomeStackNavigator
