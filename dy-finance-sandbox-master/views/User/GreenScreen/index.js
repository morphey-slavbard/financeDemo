import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import TopNavbar from '../../../components/TopNavbar'
import DY from '../../../components/DYAPI'
import { updateSettings } from '../../../actions'

export default function GreenScreen(props) {
  const router = useRoute()
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState({})
  const [isError, setIsError] = useState(false)
  const user = useSelector((state) => state.user)
  const settings = useSelector((state) => state.settings)
  const { title } = router?.params || ''
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateSettings({ key: 'selectors', value: ['expo-custom-page'] }))
  }, [])

  useEffect(() => {
    if (settings.selectors.includes('expo-custom-page'))
      getCustomPage().catch((e) => console.log(e))
  }, [JSON.stringify(settings.selectors)])

  // Get categories based on account type
  const getCustomPage = async () => {
    const dyContext = {
      page: {
        location: '/',
        referrer: '/',
        type: 'HOMEPAGE',
        data: [],
      },
      pageAttributes: {
        account_type: user?.type,
        screen: 'middle_btn',
      },
    }

    await DY.choose(settings, dyContext)
      .then((result) => {
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
          setContent(choice?.variations[0]?.payload.data)
        })
        setLoading(false)
      })
      .catch(() => {
        setIsError(!isError)
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' color='#000' />
      </View>
    )
  }

  if (isError) {
    return (
      <View style={props.theme.innerContainers}>
        <TopNavbar screen={title} navigation={props?.navigation} />
        <View style={style.errorCard}>
          <Text style={[style.errorCardText]}>Something went wrong!</Text>
          <Text style={[style.errorCardText]}>Check Settings</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View style={props.theme.innerContainers}>
        <TopNavbar screen={title} navigation={props?.navigation} />

        <ScrollView
          style={style.itemContainer}
          contentContainerStyle={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {content?.title.length > 0 && (
            <Text style={style.itemHeader}>{content?.title}</Text>
          )}
          {content?.image && (
            <Image
              source={{ uri: content?.image }}
              style={style.itemImage}
              resizeMode='contain'
            />
          )}
          {content?.content.length > 0 && (
            <Text style={style.itemContent}>{content?.content}</Text>
          )}

          {content?.cta && (
            <TouchableOpacity
              style={[
                style.itemBtn,
                { backgroundColor: settings.themeSettings.btnBackgroundColor },
              ]}
              onPress={() => console.log('Apply something here')}
            >
              <Text
                style={[
                  style.itemBtnText,
                  { color: settings.themeSettings.btnTextColor },
                ]}
              >
                {content?.cta}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    )
  }
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
    marginBottom: 20,
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
  },
  itemContent: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#626161',
  },
  itemBtn: {
    minWidth: 90,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBtnText: {
    fontFamily: 'Roboto',
    fontSize: 16,
  },
  errorCard: {
    marginTop: '50%',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b011ec',
  },
  errorCardText: {
    width: '100%',
    fontFamily: 'Roboto_medium',
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
  },
})
