import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import DY from '../components/DYAPI'
import { useDispatch, useSelector } from 'react-redux'
import { updateSettings } from '../actions'

const deviceWidth = Dimensions.get('window').width
const securePayment = require('../assets/secure-payment.jpeg')

export default function OverviewAd(props) {
  const dispatch = useDispatch()

  if (props?.campaign) {
    const [banner, setBanner] = useState(null)
    const settings = useSelector((state) => state.settings)

    useEffect(() => {
      const dyContext = {
        page: {
          location: '/',
          referrer: '/',
          type: props?.context,
          data: [],
        },
        device: {
          ip: '1.1.1.1',
        },
      }

      const selectors = [props?.campaign]

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

          response.choices.forEach(({ variations }) => {
            if (variations.length > 0) {
              setBanner(variations[0])
            }
          })
        })
        .catch((e) => console.log(e))
    }, [])

    return (
      <View style={style.container}>
        <ImageBackground
          source={{ uri: banner?.payload?.data?.image }}
          resizeMode='cover'
          style={StyleSheet.absoluteFillObject}
        >
          <LinearGradient
            style={style.linearContainer}
            colors={['rgba(105, 79, 173, 0.3)', 'rgba(105, 79, 173, 1)']}
          >
            <Text style={style.linearHeaderText}>
              {banner?.payload?.data?.title}
            </Text>
            <Text style={style.linearSubText}>
              {banner?.payload?.data?.subtitle}
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>
    )
  } else if (props?.type === 'image') {
    return (
      <View style={style.container}>
        <ImageBackground
          source={securePayment}
          resizeMode='cover'
          style={StyleSheet.absoluteFillObject}
        >
          <LinearGradient
            style={style.linearContainer}
            colors={['rgba(105, 79, 173, 0.3)', 'rgba(105, 79, 173, 1)']}
          >
            <Text style={style.linearHeaderText}>
              Secure payment from dyPay
            </Text>
            <Text style={style.linearSubText}>
              We make security at top level. Sleep without worrying for your
              investments.
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>
    )
  } else {
    return (
      <View style={style.container}>
        <LinearGradient
          style={[
            StyleSheet.absoluteFillObject,
            {
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
          colors={['rgba(105, 79, 173, 0.4)', 'rgba(105, 79, 173, 0.9)']}
          start={[0.5, 0]}
          end={[0.5, 1]}
        >
          <FontAwesome name='pie-chart' size={120} color='#fff' />

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              width: '60%',
            }}
          >
            <Text style={style.containerHeaderText}>Hey, Kaloyan</Text>
            <Text style={style.containerSubText}>
              Use your dyPay without any hidden costs, send your money how you
              want without limitations.
            </Text>
          </View>
        </LinearGradient>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 20,
    width: deviceWidth - 25,
    height: 160,
    borderRadius: 10,
    backgroundColor: 'transparent',
    padding: 15,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  linearContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 90,
    padding: 15,
  },
  linearHeaderText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#fff',
  },
  linearSubText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#dadada',
  },
  containerHeaderText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  containerSubText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#f5f5f5',
  },
})
