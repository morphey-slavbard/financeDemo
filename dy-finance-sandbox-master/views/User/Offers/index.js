import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native'
import TopNavbar from '../../../components/TopNavbar'
import { useSelector } from 'react-redux'
import DY from '../../../components/DYAPI'

export default function Offers(props) {
  const user = useSelector((state) => state.user)
  const settings = useSelector((state) => state.settings)
  const [loading, setLoading] = useState(true)
  const [offers, setOffers] = useState([])
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    getOffers().catch((e) => console.log(e))

    return () => {
      setOffers([])
    }
  }, [])

  // Get offers
  const getOffers = async () => {
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

    const selectors = ['expo-offers-slider']

    return await DY.choose({ ...settings, selectors }, dyContext)
      .then((response) => {
        let offersArr = []
        response?.choices?.forEach(({ variations }) => {
          variations?.forEach((offer) => {
            offersArr.push(offer?.payload?.data)
          })
          setOffers(offersArr)
        })

        setLoading(false)
      })
      .catch(() => {
        setIsError(!isError)
        setLoading(false)
      })
  }

  // Send event on offer click
  const sendOfferEvent = async (sku) => {
    return await DY.reportEvent(settings, [
      {
        name: 'Add to Cart',
        properties: {
          dyType: 'add-to-cart-v1',
          value: 1,
          currency: 'USD',
          productId: sku,
          quantity: 1,
        },
      },
    ])
  }

  //Render items
  const _renderOffer = (item, cta) => {
    const { productData, sku } = item?.item

    return (
      <View style={style.cardContainer}>
        <View style={style.cardInnerContainer}>
          <View style={{ flexBasis: '30%' }}>
            {productData?.image_url && (
              <Image
                source={{ uri: productData?.image_url }}
                style={{ width: '100%', height: 90 }}
                resizeMode='contain'
              />
            )}
          </View>

          <View style={{ flexBasis: '50%', padding: 10 }}>
            <Text style={style.cardTitle} numberOfLines={2}>
              {productData?.name}
            </Text>
            <Text
              numberOfLines={3}
              allowFontScaling={true}
              style={style.cardDescription}
            >
              {productData?.description}
            </Text>
          </View>

          {cta && (
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
                    backgroundColor:
                      settings?.themeSettings?.btnBackgroundColor,
                  },
                ]}
                onPress={() => sendOfferEvent(sku)}
              >
                <Text
                  style={[
                    style.cardBtnText,
                    { color: settings?.themeSettings?.btnTextColor },
                  ]}
                >
                  {cta}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
        <TopNavbar screen='Offers' navigation={props?.navigation} />
        <View style={style.errorCard}>
          <Text style={style.errorCardText}>Something went wrong!</Text>
          <Text style={style.errorCardText}>Check Settings.</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View style={props.theme.innerContainers}>
        <TopNavbar screen='Offers' navigation={props?.navigation} />

        <View style={{ flex: 1, padding: 10, marginBottom: 45 }}>
          {offers
            ? offers.map((offer, index) => {
                return offer?.slots.length > 0 ? (
                  <View
                    key={`offer#${index}`}
                    style={{ flexGrow: 1, marginTop: 10, marginBottom: 65 }}
                  >
                    <Text style={style.serviceHeader} numberOfLines={2}>
                      {offer?.custom?.title}
                    </Text>
                    <FlatList
                      data={offer?.slots}
                      renderItem={(item) =>
                        _renderOffer(item, offer?.custom?.cta)
                      }
                      initialNumToRender={5}
                      maxToRenderPerBatch={5}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
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
                      keyExtractor={(item, index) => `offer_${index}`}
                    />
                  </View>
                ) : null
              })
            : null}
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  serviceContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 5,
  },
  serviceHeader: {
    fontFamily: 'Roboto_bold',
    fontSize: 16,
    color: '#694fad',
    padding: 2,
  },
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
    alignItems: 'center',
    marginTop: 10,
  },
  cardDescription: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#626161',
    marginTop: 5,
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
