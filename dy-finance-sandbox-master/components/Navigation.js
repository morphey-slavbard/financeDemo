import React from 'react'
import { TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useSelector } from 'react-redux'

//Views
import Login from '../views/Auth'
import Account from '../views/User/Account'
import Settings from '../views/User/Settings'
import Cards from '../views/User/Cards'
import Card from '../views/User/Cards/card'
import Offers from '../views/User/Offers'
import Article from '../views/Articles'
import GreenScreen from '../views/User/GreenScreen'
import Page from '../views/Page'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function RootNavigation(extraProps) {
  const articleOptions = ({ route }) => ({
    headerShown: false,
    gestureEnabled: false,
    headerStyle: {
      backgroundColor: '#694fad',
    },
    headerTitleStyle: {
      color: '#fff',
      fontFamily: 'Roboto_medium',
    },
    headerBackTitleStyle: {
      color: '#fff',
    },
    headerTintColor: '#fff',
    title: route?.params?.title.substring(0, 20) + '...' || '',
  })

  return (
    <Stack.Navigator
      initialRouteName='Login'
      detachInactiveScreens={true}
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        detachPreviousScreen: true,
      }}
    >
      <Stack.Screen name='Login'>
        {(props) => <Login {...Object.assign(props, extraProps)} />}
      </Stack.Screen>
      <Stack.Screen name='UserRoutes'>
        {(props) => <BottomNavigation {...Object.assign(props, extraProps)} />}
      </Stack.Screen>
      <Stack.Screen name='Card'>
        {(props) => <Card {...Object.assign(props, extraProps)} />}
      </Stack.Screen>

      <Stack.Screen name='Page'>
        {(props) => (
          <Page
            {...Object.assign(props, extraProps)}
            options={({ route }) => ({ title: route?.params?.title || '' })}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name='Article' options={(route) => articleOptions(route)}>
        {(props) => (
          <Article
            {...Object.assign(props, extraProps)}
            options={({ route }) => ({ title: route?.params?.title || '' })}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

function BottomNavigation(extraProps) {
  const { cards } = useSelector((state) => state.user)
  const { themeSettings } = useSelector((state) => state.settings)

  const cardsOptions = {
    tabBarIcon: ({ color }) => (
      <AntDesign name='creditcard' color={color} size={20} />
    ),
  }

  if (cards && cards.length > 0) {
    Object.assign(cardsOptions, {
      tabBarBadge: cards.length,
      tabBarBadgeStyle: {
        backgroundColor: themeSettings?.menuBadgeColor || 'red',
        color: '#fff',
      },
    })
  }

  return (
    <Tab.Navigator
      initialRouteName='Account'
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        headerStyle: {
          height: 80,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.55,
          shadowRadius: 3.5,
          elevation: 4,
        },
        tabBarActiveTintColor: themeSettings?.menuActiveTintColor || '#f0edf6',
        tabBarInactiveTintColor:
          themeSettings?.menuInActiveTintColor || '#A8A8A8FF',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: themeSettings?.menuBackgroundColor || '#694fad',
        },
      }}
    >
      <Tab.Screen
        name='Account'
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name='home' color={color} size={20} />
          ),
        }}
      >
        {(props) => <Account {...Object.assign(props, extraProps)} />}
      </Tab.Screen>

      <Tab.Screen name='Cards' options={cardsOptions}>
        {(props) => <Cards {...Object.assign(props, extraProps)} />}
      </Tab.Screen>

      <Tab.Screen
        name='GreenScreen'
        options={({ navigation }) => ({
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => navigation.navigate('GreenScreen')}
              style={{
                width: 70,
                height: 70,
                borderRadius: 40,
                backgroundColor:
                  themeSettings?.middleBtnBackgroundColor || '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                top: -35,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                zIndex: 1040,
              }}
            >
              <Feather
                name='plus'
                size={30}
                color={themeSettings?.middleBtnIconColor || '#000'}
              />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <GreenScreen {...Object.assign(props, extraProps)} />}
      </Tab.Screen>

      <Tab.Screen
        name='Offers'
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name='star' color={color} size={20} />
          ),
        }}
      >
        {(props) => <Offers {...Object.assign(props, extraProps)} />}
      </Tab.Screen>

      <Tab.Screen
        name='Settings'
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name='setting' color={color} size={20} />
          ),
        }}
      >
        {(props) => <Settings {...Object.assign(props, extraProps)} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export default function Navigation(props) {
  return (
    <NavigationContainer>
      <RootNavigation {...props} />
    </NavigationContainer>
  )
}
