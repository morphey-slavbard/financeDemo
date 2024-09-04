import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DY from '../../../components/DYAPI'
import TopNavbar from '../../../components/TopNavbar'
import { updateSettings } from '../../../actions'

export default function Cards(props) {
  const user = useSelector((state) => state.user)
  const settings = useSelector((state) => state.settings)
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState([])
  const [isError, setIsError] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const dyContext = {
      page: {
        location: '/',
        referrer: '/',
        type: 'PRODUCT',
        data: [],
      },
      device: {
        ip: '1.1.1.1',
      },
      pageAttributes: {
        account_type: user.type,
      },
    }

    const selectors = ['expo-card-products']

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
        response?.choices?.forEach(({ variations }) => {
          setCards(variations[0].payload?.data?.slots)
        })
        setLoading(false)
      })
      .catch(() => {
        setIsError(!isError)
        setLoading(false)
      })
  }, [])

  // Render cards
  const _renderCards = (item) => {
    const product = item?.item?.productData
    return (
      <View style={style.cardContainer}>
        <Text style={style.cardTitle}>{product?.name}</Text>

        <View style={style.cardInnerContainer}>
          <View style={{ flexBasis: '30%' }}>
            <Image
              source={{ uri: product?.image_url }}
              style={{ width: '100%', height: 90 }}
              resizeMode='contain'
            />
          </View>

          <View style={{ flexBasis: '50%', padding: 10 }}>
            <Text
              numberOfLines={4}
              allowFontScaling={true}
              style={style.cardDescription}
            >
              {product?.description}
            </Text>
          </View>

          <View
            style={{
              flexBasis: '20%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={[
                style.cardBtn,
                {
                  backgroundColor: settings?.themeSettings?.btnBackgroundColor,
                },
              ]}
              onPress={() => console.log('card click')}
            >
              <Text
                style={[
                  style.cardBtnText,
                  { color: settings?.themeSettings?.btnTextColor },
                ]}
              >
                Apply
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                style.cardBtn,
                {
                  backgroundColor: settings?.themeSettings?.btnBackgroundColor,
                },
              ]}
              onPress={() => console.log('card click')}
            >
              <Text
                style={[
                  style.cardBtnText,
                  { color: settings?.themeSettings?.btnTextColor },
                ]}
              >
                View
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
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
        <TopNavbar screen='Cards' navigation={props?.navigation} />
        <View style={style.errorCard}>
          <Text
            style={[
              style.errorCardText,
              { color: settings?.themeSettings?.btnTextColor },
            ]}
          >
            Somehing went wrong!
          </Text>
          <Text
            style={[
              style.errorCardText,
              { color: settings?.themeSettings?.btnTextColor },
            ]}
          >
            Check Settings
          </Text>
        </View>
      </View>
    )
  } else {
    return (
      <View style={props.theme.innerContainers}>
        <TopNavbar screen='Cards' navigation={props?.navigation} />

        <FlatList
          data={cards}
          renderItem={_renderCards}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: '90%',
                height: 1,
                backgroundColor: '#cccccc',
                alignSelf: 'center',
              }}
            />
          )}
          keyExtractor={(item) => item?.sku.toString()}
        />
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
  cardContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
  },
  cardTitle: {
    fontFamily: 'Roboto_medium',
    fontSize: 16,
    color: '#000',
  },
  cardInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  cardDescription: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#626161',
  },
  cardBtn: {
    maxWidth: 90,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.55,
    elevation: 4,
  },
  cardBtnText: {
    fontFamily: 'Roboto_medium',
    fontSize: 12,
    color: '#626161',
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
