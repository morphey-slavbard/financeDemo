import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

const deviceWidth = Dimensions.get('window').width

export default function Banner({ navigation, data }) {
  const [hide, setHide] = useState(false)

  return (
    <View style={[style.container, { display: hide ? 'none' : 'flex' }]}>
      <View
        style={[style.upper, { backgroundColor: data?.topBackgroundColor }]}
      >
        {data?.top?.length > 0 && (
          <Text style={style.upperText}>{data?.top}</Text>
        )}
        <FontAwesome
          onPress={() => setHide(!hide)}
          name='close'
          size={18}
          color='#fff'
          style={style.closeBtn}
        />
        {data?.image?.length > 0 && (
          <Image
            source={{ uri: data?.image }}
            resizeMode='contain'
            style={style.image}
          />
        )}
      </View>
      <View
        style={[style.bottom, { backgroundColor: data?.bottomBackgroundColor }]}
      >
        {data?.bottom?.length > 0 && (
          <Text
            numberOfLines={2}
            style={[
              style.bottomText,
              { color: data?.bottomFontColor, fontSize: data?.bottomFontSize },
            ]}
          >
            {data?.bottom}
          </Text>
        )}

        {data?.ctaText?.length > 0 && (
          <TouchableOpacity
            style={[
              style.ctaContainer,
              { backgroundColor: data?.ctaBackgroundColor },
            ]}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('Card')}
          >
            <Text
              style={[
                style.ctaText,
                { backgroundColor: data?.ctaBackgroundColor },
              ]}
            >
              {data?.ctaText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    width: deviceWidth - 50,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  upper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 23,
    minHeight: 120,
    backgroundColor: '#7C7C8A',
  },
  upperText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 24,
    color: '#fff',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 23,
    minHeight: 65,
    backgroundColor: '#17171A',
  },
  bottomText: {
    flexBasis: '65%',
    fontFamily: 'Roboto',
    fontSize: 13,
    color: '#fff',
  },
  ctaContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 19.5,
    paddingRight: 19.5,
    paddingTop: 10,
    paddingBottom: 10,
  },
  ctaText: {
    fontFamily: 'Roboto_medium',
    fontSize: 14,
    color: '#1865EE',
  },
  closeBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  image: {
    position: 'absolute',
    top: 20,
    width: 220,
    height: 135,
  },
})
