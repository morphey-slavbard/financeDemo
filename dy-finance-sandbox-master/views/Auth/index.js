import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native'
import Users from '../../assets/databases/users.json'
import { authorize, updateSettings } from '../../actions'
import { useDispatch, useSelector } from 'react-redux'
import DY from '../../components/DYAPI'
import { Helper } from '../../components/Helper'
import { Dropdown } from 'react-native-element-dropdown'

const window = Dimensions.get('window')
const deviceWidth = window.width
const deviceHeight = window.height

export default function Login(props) {
  const settings = useSelector((state) => state.settings)
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [appTheme, setAppTheme] = useState({})
  const [apiKeyValue, setApiKeyValue] = useState('')
  const [isApiKeyExists, setIsApiKeyExists] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [regionValue, setRegionValue] = useState('https://direct.dy-api.com')
  const [regionValueCollectionUrl, setRegionValueCollectionUrl] = useState(
    'https://direct-collect.dy-api.com'
  )
  const dispatch = useDispatch()
  const dataForDropdown = [
    {
      label: 'US',
      value: 'https://direct.dy-api.com',
      collectionValue: 'https://direct-collect.dy-api.com',
    },
    {
      label: 'EU',
      value: 'https://direct.dy-api.eu',
      collectionValue: 'https://direct-collect.dy-api.eu',
    },
  ]

  useEffect(() => {
    dispatch(authorize(Users[1]))
    if (settings.apiKey !== '') {
      setIsApiKeyExists(!isApiKeyExists)
      getData().catch((e) => console.log(e))
    }
  }, [])

  const updateAccountSettings = () => {
    if (apiKeyValue.length <= 0) return;
    dispatch(updateSettings({ key: 'apiKey', value: apiKeyValue }))
    dispatch(updateSettings({ key: 'apiHost', value: regionValue }))
    dispatch(
      updateSettings({ key: 'apiCollectHost', value: regionValueCollectionUrl })
    )
    dispatch(updateSettings({ key: 'selectors', value: ['expo-app-settings'] }))

    // Quick fix for cookies
    dispatch(updateSettings({ key: 'cookies', value: Users[1].cookies }))

    setLoading(true);
    getData().catch((e) => console.log(e))
  }

  const getData = async () => {
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

    await DY.choose(settings, dyContext)
      .then((result) => {
        if (result?.cookies) {
          const cookieValues = {
            ...settings.cookies,
            dyid: result?.cookies[0]?.value,
            dyid_server: result?.cookies[0]?.value,
            session: { dy: result?.cookies[1]?.value },
          }
          dispatch(updateSettings({ key: 'cookies', value: cookieValues }))
        }

        result?.choices.forEach((choice) => {
          const themeSettings = choice?.variations[0]?.payload.data
          dispatch(
            updateSettings({ key: 'themeSettings', value: themeSettings })
          )
          setAppTheme(themeSettings)
        })

        setIsApiKeyExists(true)
        setLoading(false)
      })
      .catch((e) => {
        console.log(e)
        setIsApiKeyExists(false)
        setLoading(false)
        setErrorMessage('Something went wrong, try again!')
      })
  }

  // Authorize user
  const auth = async () => {
    await Helper.hash(user?.email)
      .then(async (hashedEmail) => {
        await DY.reportEvent(settings, [
          {
            name: 'Login',
            properties: {
              dyType: 'login-v1',
              hashedEmail: hashedEmail,
            },
          },
        ]).catch((e) => console.log(e))
      })
      .catch((e) => {
        console.log(e)
      })

    props.navigation.navigate('UserRoutes')
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' color='#000' />
      </View>
    )
  }

  if (!isApiKeyExists) {
    return (
      <View style={style.errorContainer}>
        <Text style={style.errorContainerTextMessage}>{errorMessage}</Text>
        <Text style={style.errorContainerText}>Enter Client-side Key</Text>
        <TextInput
          style={style.keyInput}
          onChangeText={setApiKeyValue}
          value={apiKeyValue}
          placeholder='Client-Side Key'
        />
        <Dropdown
          style={style.dropdown}
          placeholderStyle={style.placeholderStyle}
          selectedTextStyle={style.selectedTextStyle}
          containerStyle={style.dropdownContainer}
          dropdownPosition='bottom'
          fontFamily='Roboto'
          value={regionValue}
          data={dataForDropdown}
          maxHeight={300}
          labelField='label'
          valueField='value'
          onChange={(value) => {
            setRegionValue(value.value)
            setRegionValueCollectionUrl(value.collectionValue)
          }}
        />
        <TouchableOpacity onPress={() => updateAccountSettings()}>
          <Text style={[style.keyBtn]}>Update Settings</Text>
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <View
        style={[
          props.theme.innerContainers,
          { alignItems: 'center', justifyItems: 'space-between' },
        ]}
      >
        <SafeAreaView
          style={[
            style.safeContainer,
            { backgroundColor: appTheme?.headerColor },
          ]}
        />

        <View style={style.authContainer}>
          <ImageBackground
            imageStyle={{ borderRadius: 20 }}
            resizeMode='cover'
            style={[
              StyleSheet.absoluteFillObject,
              { justifyContent: 'flex-start', alignItems: 'center' },
            ]}
            source={{ uri: appTheme?.loginBackground }}
          >
            <Text style={[style.authHeader, { color: appTheme?.textColor }]}>
              Good evening,
            </Text>
            <Text style={[style.authUsername, { color: appTheme?.textColor }]}>
              {user?.firstname}
            </Text>

            <TouchableOpacity
              style={[
                style.btnAuth,
                { backgroundColor: appTheme?.btnBackgroundColor },
              ]}
              activeOpacity={0.65}
              onPress={() => auth()}
            >
              <Text
                style={[style.btnAuthText, { color: appTheme?.btnTextColor }]}
              >
                Login to your account
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  safeContainer: {
    width: '100%',
    height: deviceHeight / 5.5,
    backgroundColor: 'red',
  },
  authContainer: {
    marginTop: -90,
    width: deviceWidth - 50,
    height: deviceHeight / 1.3,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  authHeader: {
    fontFamily: 'Roboto_medium',
    lineHeight: 33,
    fontSize: 20,
    color: '#000',
    marginTop: 50,
  },
  authUsername: {
    fontFamily: 'Roboto_bold',
    fontSize: 22,
    color: '#000',
  },
  btnAuth: {
    marginTop: 25,
    width: deviceWidth / 1.5,
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  btnAuthText: {
    fontFamily: 'Roboto_bold',
    color: '#fff',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  errorText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    padding: 8,
    color: '#FF7A6A',
  },
  errorContainer: {
    width: '100%',
    marginTop: 200,
  },
  errorContainerText: {
    fontSize: 30,
    width: '100%',
    textAlign: 'center',
  },
  errorContainerTextMessage: {
    fontSize: 24,
    margin: 20,
    textAlign: 'center',
    color: 'red',
  },
  keyInput: {
    borderColor: '#000',
    borderWidth: 1,
    marginHorizontal: 40,
    marginVertical: 20,
    height: 50,
    padding: 5,
  },
  keyBtn: {
    backgroundColor: '#000',
    color: '#fff',
    marginHorizontal: 40,
    marginVertical: 20,
    height: 40,
    paddingTop: 5,
    fontSize: 22,
    textAlign: 'center',
  },
  dropdown: {
    margin: 0,
    height: 45,
    marginHorizontal: 40,
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
  },
  dropdownContainer: {
    marginTop: Platform.OS === 'android' ? -20 : 6,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.55,
    elevation: 2,
  },
  placeholderStyle: {
    fontFamily: 'Roboto',
    fontSize: 16,
  },
  selectedTextStyle: {
    fontFamily: 'Roboto',
    fontSize: 16,
  },
})
