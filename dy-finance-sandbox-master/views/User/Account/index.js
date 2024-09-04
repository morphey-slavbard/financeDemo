import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helper } from '../../../components/Helper'
import TopNavbar from '../../../components/TopNavbar'
import { Dropdown } from 'react-native-element-dropdown'
import Users from '../../../assets/databases/users.json'
import {authorize, updateSettings} from '../../../actions'
import DY from '../../../components/DYAPI'
import { AntDesign } from '@expo/vector-icons'
import Banner from '../../../components/Banner'
import {useFocusEffect} from "@react-navigation/native";

export default function Account(props) {
  const user = useSelector((state) => state.user)
  const settings = useSelector((state) => state.settings)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [banner, setBanner] = useState({})
  const [articles, setArticles] = useState([])
  const [offers, setOffers] = useState([])
  const [isError, setIsError] = useState(false)
  const dispatch = useDispatch()

  // Run init cycle
  useEffect(() => {
    getInit().catch((e) => console.log(e))
  }, [user])

  // Get init based on account type
  const getInit = async () => {
    setLoading(true)

    dispatch(updateSettings({
      key: 'selectors',
      value: ["expo-app-settings", "expo-categories", "expo-hp-banner", "expo-articles-slider", "expo-offers-slider"],
    }))

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

    // Quick fix for cookies
    dispatch(updateSettings({ key: 'cookies', value: user?.cookies }))

    await DY.choose(settings, dyContext)
      .then((result) => {
        let banners = {}
        let articlesArr = []
        let offersArray = []

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
            choice?.name === 'expo-categories' &&
            choice?.variations.length > 0
          ) {
            const categories = choice?.variations[0]?.payload?.data
            const clearCategories = categories?.filter(
              (cat) => cat?.title.length > 0 || cat?.slug.length > 0
            )
            clearCategories?.sort((a, b) => a.order - b.order)
            setCategories(clearCategories)
          }

          if (
            choice?.name === 'expo-articles-slider' &&
            choice?.variations.length > 0
          ) {
            const articles = choice?.variations
            articles?.forEach((article) => {
              articlesArr.push(article?.payload?.data)
            })
          }

          if (
            choice?.name === 'expo-offers-slider' &&
            choice?.variations.length > 0
          ) {
            const offersArr = choice?.variations
            offersArr?.forEach((offer) => {
              offersArray.push(offer?.payload?.data)
            })
          }

          if (
            choice?.name === 'expo-hp-banner' &&
            choice?.variations.length > 0
          ) {
            banners = choice?.variations[0]?.payload?.data
          }
        })

        setBanner(banners)
        setArticles(articlesArr)
        setOffers(offersArray)
        setLoading(false)

        return () => {
          setCategories([])
          setBanner({})
          setArticles([])
          setOffers([])
          setLoading(true)
        }
      })
      .catch(() => {
        setIsError(!isError)
        setLoading(false)
      })
  }

  // Change user
  const changeUser = async (item) => {
    const dyContext = {
      page: {
        location: '/',
        referrer: '/',
        type: 'HOMEPAGE',
        data: [],
      },
      pageAttributes: {
        account_type: item?.type,
      },
    }

    // Add selectors
    dispatch(updateSettings({
      key: 'selectors',
      value: ["expo-app-settings", "expo-categories", "expo-hp-banner", "expo-articles-slider", "expo-offers-slider"],
    }))

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
        result?.choices.forEach((choice) => {
          const themeSettings = choice?.variations[0]?.payload.data
          dispatch(
            updateSettings({ key: 'themeSettings', value: themeSettings })
          )
        })

        dispatch(authorize(item))
      })
      .catch(() => {
        setIsError(!isError)
        setLoading(false)
      })
  }

  // Render inner cats
  const _renderCats = ({
    title,
    icon,
    slug,
    backgroundColor,
    color,
    balance,
  }) => (
    <TouchableOpacity
      key={`cat_${slug}`}
      activeOpacity={0.65}
      onPress={() => {
        if (balance && balance > 0) {
          user.balance = balance
        }

        props.navigation.navigate('Page', { title, slug })
        DY.reportEvent(settings, [
          {
            name: 'Custom page',
            properties: {
              account_type: user?.type,
              slug: slug,
            },
          },
        ]).catch((e) => console.log(e))
      }}
      style={[style.catWrapper, { backgroundColor: backgroundColor }]}
    >
      {icon && (
        <Image
          source={{ uri: icon }}
          style={style.categoryIcon}
          resizeMode='contain'
        />
      )}
      <View style={{ width: '50%' }}>
        <Text
          numberOfLines={2}
          allowFontScaling={true}
          style={[style.catText, { color: color }]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )

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
    ]).catch((e) => console.log(e))
  }

  // Render Article
  const _renderArticle = (item, cta) => {
    const { productData, sku } = item?.item
    const index = item?.index

    return (
      <View
        activeOpacity={0.75}
        style={[style.articleContainer, { marginLeft: index === 0 ? 10 : 0 }]}
      >
        {productData?.image_url && (
          <Image
            source={{ uri: productData.image_url }}
            style={style.articleImage}
          />
        )}
        <View style={[style.articleBody, { width: '100%' }]}>
          <Text
            style={style.articleTitle}
            allowFontScaling={true}
            numberOfLines={1}
          >
            {productData?.name}
          </Text>
          <Text
            style={style.articleDesc}
            allowFontScaling={true}
            numberOfLines={3}
            ellipsizeMode='clip'
          >
            {productData?.description}
          </Text>
          <TouchableOpacity
            style={[
              style.cardBtn,
              {
                backgroundColor: settings?.themeSettings?.btnBackgroundColor,
                marginTop: 10,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => {
              sendOfferEvent(sku).then(() =>
                props.navigation.navigate('Article', {
                  title: productData?.name,
                  article: productData,
                  cta,
                })
              )
            }}
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
      </View>
    )
  }

  // Render offer
  const _renderOffer = (item, cta) => {
    const { productData, sku } = item?.item
    const index = item?.index

    return (
      <View
        activeOpacity={0.75}
        style={[style.offerContainer, { marginLeft: index === 0 ? 10 : 0 }]}
      >
        {productData?.image_url && (
          <Image
            source={{ uri: productData.image_url }}
            style={[
              style.articleImage,
              { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
            ]}
            resizeMode='contain'
          />
        )}
        <View style={{ width: '100%', position: 'relative' }}>
          {productData?.expiry_date && (
            <View style={style.offerExpireContainer}>
              <Text style={style.offerExpireText}>
                {productData?.expiry_date}
              </Text>
            </View>
          )}
          <Text
            style={[style.articleTitle, { fontSize: 14 }]}
            allowFontScaling={true}
            numberOfLines={1}
            ellipsizeMode='clip'
          >
            {productData?.name}
          </Text>
          <Text
            style={[style.articleDesc, { height: 40 }]}
            allowFontScaling={true}
            numberOfLines={3}
            ellipsizeMode='middle'
          >
            {productData?.description}
          </Text>
          <TouchableOpacity
            style={[
              style.cardBtn,
              { backgroundColor: settings?.themeSettings?.btnBackgroundColor },
            ]}
            activeOpacity={0.85}
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
        <TopNavbar screen='Account' custom>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => console.log('Pressed first icon')}
            >
              <AntDesign
                name='bars'
                size={24}
                color={settings?.themeSettings?.generalTextColor || '#fff'}
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
            <Text
              style={[
                style.headerStyle,
                { color: settings?.themeSettings?.generalTextColor },
              ]}
            >
              Account
            </Text>
          </View>
        </TopNavbar>
        <View style={style.errorCard}>
          <Text style={[style.errorCardText]}>Something went wrong!</Text>
          <Text style={[style.errorCardText]}>Check Settings</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View style={props.theme.innerContainers}>
        <TopNavbar screen='Account' custom>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => console.log('Pressed first icon')}
            >
              <AntDesign
                name='bars'
                size={24}
                color={settings?.themeSettings?.generalTextColor || '#fff'}
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
            <Text
              style={[
                style.headerStyle,
                { color: settings?.themeSettings?.generalTextColor },
              ]}
            >
              Account
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => console.log('Pressed first icon')}
            >
              <AntDesign
                name='wechat'
                size={24}
                color={settings?.themeSettings?.generalTextColor || '#fff'}
              />
            </TouchableOpacity>
            <Dropdown
              style={[
                style.dropdown,
                { backgroundColor: settings?.themeSettings?.generalTextColor },
              ]}
              placeholderStyle={[
                style.placeholderStyle,
                { color: settings?.themeSettings?.headerColor || '#000' },
              ]}
              selectedTextStyle={[
                style.selectedTextStyle,
                { color: settings?.themeSettings?.headerColor || '#000' },
              ]}
              containerStyle={style.dropdownContainer}
              dropdownPosition='bottom'
              imageStyle={style.imageStyle}
              iconStyle={style.iconStyle}
              fontFamily='Roboto'
              data={Users}
              maxHeight={300}
              labelField='initials'
              valueField='id'
              imageField='avatar'
              renderRightIcon={() => null}
              placeholder={`${user?.firstname?.substring(
                0,
                1
              )}${user?.lastname?.substring(0, 1)}`}
              onChange={(item) => changeUser(item)}
            />
          </View>
        </TopNavbar>

        <View style={{ flex: 1, paddingBottom: 45 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              justifyContent: 'space-between',
              paddingBottom: 45,
            }}
          >
            <View style={style.balanceStyleContainer}>
              <Text style={style.balanceHeader}>My balance</Text>
              <Text style={style.balanceTotal}>
                {Helper.currencyFormat(user?.balance || 0)}
              </Text>
            </View>

            <View style={style.categoriesGrid}>
              {categories?.map((cat) => _renderCats(cat))}
            </View>

            {banner && <Banner navigation={props.navigation} data={banner} />}

            <View style={{ marginTop: 10 }}>
              {offers
                ? offers.map((offer, index) => {
                    return offer?.slots.length > 0 ? (
                      <View key={`offer#${index}`}>
                        <Text style={style.articleHeader} numberOfLines={2}>
                          {offer?.custom?.title}
                        </Text>
                        <FlatList
                          data={offer?.slots}
                          contentContainerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          renderItem={(item) =>
                            _renderOffer(item, offer?.custom?.cta)
                          }
                          initialNumToRender={5}
                          maxToRenderPerBatch={5}
                          showsVerticalScrollIndicator={false}
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={(item, index) => `offer_${index}`}
                          horizontal={true}
                        />
                      </View>
                    ) : null
                  })
                : null}

              {articles
                ? articles.map((article, index) => {
                    return article?.slots.length > 0 ? (
                      <View key={`article#${index}`}>
                        <Text style={style.articleHeader} numberOfLines={2}>
                          {article?.custom?.title}
                        </Text>
                        <FlatList
                          data={article?.slots}
                          contentContainerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          renderItem={(item) =>
                            _renderArticle(item, article?.custom?.cta)
                          }
                          initialNumToRender={5}
                          maxToRenderPerBatch={5}
                          showsVerticalScrollIndicator={false}
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={(item, index) => `article_${index}`}
                          horizontal={true}
                        />
                      </View>
                    ) : null
                  })
                : null}
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  scrollContainer: {
    borderWidth: 1,
    borderColor: 'red',
    flexDirection: 'column',
    padding: 15,
    marginTop: 5,
  },
  headerStyle: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: '#fff',
    marginLeft: 15,
  },
  balanceStyleContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  balanceHeader: {
    fontFamily: 'Roboto_medium',
    fontSize: 16,
    color: '#646464',
  },
  balanceTotal: {
    fontFamily: 'Roboto',
    fontSize: 36,
    color: '#000',
    marginTop: 5,
  },
  categoriesGrid: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  catWrapper: {
    flexDirection: 'row',
    flexBasis: '45%',
    borderRadius: 8,
    height: 90,
    margin: 5,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.55,
    elevation: 4,
  },
  catText: {
    fontFamily: 'Roboto_medium',
    fontSize: 16,
    textAlign: 'left',
    color: '#000',
  },
  categoryIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  userHeader: {
    fontFamily: 'Roboto_medium',
    fontSize: 16,
    color: '#fff',
  },
  dropdown: {
    margin: 10,
    height: 30,
    width: 32,
    backgroundColor: '#fff',
    borderRadius: 17,
    paddingHorizontal: 6,
  },
  dropdownContainer: {
    marginLeft: -30,
    marginTop: Platform.OS === 'android' ? -20 : 6,
    width: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.55,
    elevation: 5,
  },
  imageStyle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  placeholderStyle: {
    fontFamily: 'Roboto',
    fontSize: 16,
  },
  selectedTextStyle: {
    fontFamily: 'Roboto',
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  bannerContainer: {
    width: '90%',
    maxHeight: 320,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.55,
    elevation: 4,
    backgroundColor: '#fff',
  },
  bannerImageBackgroundContainer: {
    width: '100%',
    height: '100%',
  },
  bannerTitle: {
    fontFamily: 'Roboto_bold',
    fontSize: 20,
    color: '#fff',
    padding: 8,
  },
  bannerSubText: {
    fontFamily: 'Roboto_medium',
    fontSize: 18,
    color: '#fff',
    padding: 20,
  },
  bannerImage: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    width: '95%',
    height: '100%',
  },
  offerContainer: {
    width: 190,
    height: 200,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#fefefe',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 35,
    paddingLeft: 10,
    paddingRight: 10,
  },
  articleContainer: {
    width: 190,
    height: 240,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#fefefe',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 35,
  },
  articleHeader: {
    fontFamily: 'Roboto_medium',
    fontSize: 18,
    marginTop: 20,
    marginLeft: 10,
    color: '#000',
  },
  articleImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  articleBody: {
    paddingTop: 5,
    padding: 10,
  },
  articleTitle: {
    fontFamily: 'Roboto_medium',
    fontSize: 16,
    color: '#494949',
  },
  articleDesc: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#b2b2b2',
    paddingTop: 5,
  },
  cardBtn: {
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
  offerExpireContainer: {
    position: 'absolute',
    top: -25,
    left: -1,
    padding: 4,
    backgroundColor: 'red',
    borderRadius: 12,
  },
  offerExpireText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#fff',
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
