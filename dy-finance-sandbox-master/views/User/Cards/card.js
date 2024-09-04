import React, { useEffect, useState } from 'react'
import {
  AppState,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import DY from '../../../components/DYAPI'
import TopNavbar from '../../../components/TopNavbar'
import * as Notifications from 'expo-notifications'
import { updateSettings } from '../../../actions'

export default function Card(props) {
  const user = useSelector((state) => state.user)
  const settings = useSelector((state) => state.settings)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState(`${user.firstname} ${user.lastname}`)
  const [phone, setPhone] = useState('')
  const [form, setForm] = useState({})
  const [errorName, setErrorName] = useState('')
  const [errorPhone, setErrorPhone] = useState('')
  const [notification, setNotification] = useState({
    title: `Apply for card`,
    body: `Don’t miss out on rewards! Complete your application`,
    data: { data: 'event-reminder-v1' },
    delay: 5,
  })

  const dyContext = {
    page: {
      location: '/',
      referrer: '/',
      type: 'HOMEPAGE',
      data: [],
    },
    pageAttributes: {
      account_type: user?.type,
    },
  }

  useEffect(() => {
    dispatch(
      updateSettings({ key: 'selectors', value: ['expo-push-notification'] })
    )
    getNotification().catch((e) => console.log(e))
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange
    )
    return () => {
      subscription.remove()
    }
  }, [phone, name])

  // Get notification
  const getNotification = async () => {
    await DY.choose(settings, dyContext).then((result) => {
      if (result?.cookies) {
        const cookieValues = {
          ...settings.cookies,
          dyid: result.cookies[0].value,
          dyid_server: result.cookies[0].value,
          session: {
            dy: result.cookies[1].value,
          },
        }
        dispatch(updateSettings({ key: 'cookies', value: cookieValues }))
      }

      result?.choices?.forEach((choice) => {
        if (
          choice?.name === 'expo-push-notification' &&
          choice?.variations.length > 0
        ) {
          const notification = choice?.variations[0]?.payload?.data
          setNotification(notification)
        }
      })

      return () => {
        setNotification({
          title: `Apply for card`,
          body: `Don’t miss out on rewards! Complete your application`,
          data: { data: 'event-reminder-v1' },
          delay: 5,
        })
      }
    })
  }

  const _handleAppStateChange = (event) => {
    if (event === 'background' && phone.length > 2 && name.length > 2) {
      schedulePushNotification().catch((e) => console.log(e))
    }
  }

  const schedulePushNotification = async () => {
    if (notification?.enabled === 'false') {
      return
    }

    await Notifications.scheduleNotificationAsync({
      content: notification,
      trigger: { seconds: notification?.delay || 5 },
    })
  }

  useEffect(() => {
    const dyContext = {
      page: {
        location: '/',
        referrer: '/',
        type: 'OTHER',
        data: [],
      },
      device: {
        ip: '1.1.1.1',
      },
      pageAttributes: {
        account_type: user.type,
      },
    }

    const selectors = ['expo-card-form']

    DY.choose({ ...settings, selectors }, dyContext)
      .then((response) => {
        const cookieValues = {
          ...settings.cookies,
          dyid: response.cookies[0].value,
          dyid_server: response.cookies[0].value,
          session: {
            dy: response.cookies[1].value,
          },
        }
        dispatch(updateSettings({ key: 'cookies', value: cookieValues }))
        response?.choices.forEach(({ variations }) => {
          setForm(variations[0].payload.data)
        })

        setLoading(false)
      })
      .catch((e) => console.log(e))
  }, [])

  // Submit card
  const submitCard = async () => {
    if (name.length > 0 && phone.length > 2) {
      Object.assign(dyContext, {
        pageAttributes: { account_type: user?.type, form_submit: 'true' },
      })
      dispatch(
        updateSettings({ key: 'selectors', value: ['expo-push-notification'] })
      )

      await DY.choose(settings, dyContext).then((result) => {
        result?.choices?.forEach(async (choice) => {
          if (
            choice?.name === 'expo-push-notification' &&
            choice?.variations.length > 0
          ) {
            const submitNotification = choice?.variations[0]?.payload?.data

            if (submitNotification?.enabled === 'true') {
              await Notifications.scheduleNotificationAsync({
                content: submitNotification,
                trigger: { seconds: submitNotification?.delay || 2 },
              })
            }
          }
        })
      })

      // Send custom event
      await DY.reportEvent(settings, [
        {
          name: 'card_application',
          properties: {
            cardType: 'awards',
          },
        },
      ]).catch((error) => console.log(error))

      props.navigation.navigate('UserRoutes')
    } else {
      if (name.length <= 0) {
        setErrorName('Please, fill up the field.')
      } else {
        setErrorName([])
      }

      if (phone.length <= 0) {
        setErrorPhone('This field is required!')
      } else {
        setErrorPhone([])
      }
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' color='#000' />
      </View>
    )
  }

  return (
    <View style={props.theme.innerContainers}>
      <TopNavbar navigation={props?.navigation} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={style.itemContainer}
          contentContainerStyle={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Text style={style.itemHeader}>{form?.title}</Text>
          {form?.image && (
            <Image
              source={{ uri: form?.image }}
              style={style.itemImage}
              resizeMode='contain'
            />
          )}

          <View style={style.fieldsContainer}>
            <TextInput
              style={style.field}
              placeholder='John Doe'
              placeholderTextColor='rgba(0, 0, 0, 0.6)'
              defaultValue={name}
              onChangeText={(value) => setName(value)}
            />
            {errorName.length > 0 && (
              <Text style={style.errorText}>{errorName}</Text>
            )}
          </View>

          <View style={style.fieldsContainer}>
            <TextInput
              style={style.field}
              placeholder='e.g +371 123 233 34'
              keyboardType='phone-pad'
              placeholderTextColor='rgba(0, 0, 0, 0.6)'
              defaultValue={phone}
              onChangeText={(value) => setPhone(value)}
            />
            {errorPhone.length > 0 && (
              <Text style={style.errorText}>{errorPhone}</Text>
            )}
          </View>

          <Text style={style.itemContent}>{form.content}</Text>

          <TouchableOpacity
            style={[
              style.itemBtn,
              {
                backgroundColor: settings?.themeSettings?.btnBackgroundColor,
                marginTop: form?.content ? 20 : 0,
              },
            ]}
            onPress={() => submitCard()}
          >
            <Text
              style={[
                style.itemBtnText,
                { color: settings?.themeSettings?.btnTextColor },
              ]}
            >
              {form.cta}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const style = StyleSheet.create({
  itemContainer: {
    flexDirection: 'column',
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemImage: {
    width: '100%',
    height: 220,
    marginBottom: 10,
    marginLeft: -5,
  },
  itemDayHeader: {
    fontFamily: 'Roboto_medium',
    fontSize: 18,
    color: '#694fad',
    padding: 10,
    marginBottom: -15,
  },
  itemHeader: {
    fontFamily: 'Roboto_medium',
    fontSize: 20,
    color: '#000',
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  itemContent: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#626161',
  },
  itemBtn: {
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBtnText: {
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  fieldsContainer: {
    width: '100%',
    paddingTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  field: {
    fontFamily: 'Roboto',
    fontSize: 16,
    letterSpacing: 0.15,
    width: '100%',
    backgroundColor: '#fff',
    height: 45,
    paddingLeft: 10,
    paddingTop: 16,
    paddingBottom: 5,
  },
  errorText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#ad2424',
    paddingTop: 10,
  },
})
