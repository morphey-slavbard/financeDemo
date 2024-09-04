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
import TopNavbar from '../../components/TopNavbar'
import DY from '../../components/DYAPI'
import { updateSettings } from '../../actions'

export default function Page(props) {
  const router = useRoute()
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState({})
  const user = useSelector((state) => state.user)
  const settings = useSelector((state) => state.settings)
  const { title, slug } = router?.params || ''
  const dispatch = useDispatch()

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
        slug: slug,
      },
    }

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
        setContent(choice?.variations[0]?.payload.data)
      })
      setLoading(false)
    })
  }

  useEffect(() => {
    dispatch(updateSettings({ key: 'selectors', value: ['expo-custom-page'] }))
    getCustomPage().catch((e) => console.log(e))
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' color='#000' />
      </View>
    )
  }

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
          <View style={style.imageContainer}>
            <Image
              source={{ uri: content?.image }}
              style={style.itemImage}
              resizeMode='cover'
            />
          </View>
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

const style = StyleSheet.create({
  itemContainer: {
    flexDirection: 'column',
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  itemImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.45,
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
})
