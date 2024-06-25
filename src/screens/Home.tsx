import React from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '../navigations/navigationTypes'

export default function Home(): JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Go to Movie Detail"
        onPress={() => navigation.navigate('MovieDetail')}
      />
    </View>
  )
}
