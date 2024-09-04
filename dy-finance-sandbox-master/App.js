import React, { useState, useEffect, useCallback, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Animated, Platform } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import Navigation from './components/Navigation'
import { Style } from './components/Themes'
import { Provider } from 'react-redux'
import store from './store'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { LogBox } from 'react-native'

// Ignore log notification by message
LogBox.ignoreLogs([
  "[Reanimated] Couldn't determine the version of the native part of Reanimated.",
]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export default function App() {
  const animation = useRef(new Animated.Value(0)).current
  const [isReady, setIsReady] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()

  //Load custom assets
  const _loadResourcesAsync = async () => {
    await SplashScreen.preventAutoHideAsync()

    return Promise.all([
      Asset.loadAsync([
        require('./assets/dy-logo.png'),
        require('./assets/dy-logo-white.webp'),
        require('./assets/all-in-one.png'),
        require('./assets/authorization.png'),
        require('./assets/easy-steps.png'),
      ]),
      Font.loadAsync({
        Roboto_bold: require('./assets/fonts/Roboto-Bold.ttf'),
        Roboto_medium: require('./assets/fonts/Roboto-Medium.ttf'),
        Roboto: require('./assets/fonts/Roboto-Regular.ttf'),
      }),
    ])
  }

  useEffect(() => {
    _loadResourcesAsync()
      .then(async () => {
        registerForPushNotificationsAsync()
          .then((token) => setExpoPushToken(token))
          .catch((e) => console.log(e))

        notificationListener.current =
          Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification)
          })

        setIsReady(true)

        return () => {
          Notifications.removeNotificationSubscription(
            notificationListener.current
          )
        }
      })
      .catch((e) => console.log(e))
  }, [])

  //Root view
  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync()

      //Splash animation
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    }
  }, [isReady])

  if (!isReady) {
    return null
  }

  return (
    <View style={Style.container} onLayout={onLayoutRootView}>
      <StatusBar style='auto' />
      <Provider store={store}>
        <Navigation theme={Style} />
      </Provider>
    </View>
  )

  async function registerForPushNotificationsAsync() {
    let token
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return
      }
      token = (await Notifications.getExpoPushTokenAsync()).data
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    return token
  }
}
