import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Search from '../screens/Search'
import MovieDetail from '../screens/MovieDetail'
import CategorySearchResult from '../screens/CategorySearchResult'

const Stack = createNativeStackNavigator()

const SearchStackNavigator = (): JSX.Element => (
  <Stack.Navigator initialRouteName="Search">
    <Stack.Screen name="Search" component={Search} />
    <Stack.Screen name="MovieDetail" component={MovieDetail} />
    <Stack.Screen
      name="CategorySearchResult"
      component={CategorySearchResult}
    />
  </Stack.Navigator>
)

export default SearchStackNavigator
