import React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useSelector } from 'react-redux'

export default function TopNavbar(props) {
  const settings = useSelector((state) => state.settings)

  return (
    <SafeAreaView
      style={[
        style.container,
        { backgroundColor: settings?.themeSettings?.headerColor },
      ]}
    >
      {props?.custom ? (
        props.children
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => props?.navigation?.navigate('Account')}
            >
              <AntDesign
                name='bars'
                size={24}
                color={settings?.themeSettings?.generalTextColor || '#fff'}
                style={style.leftHeader}
              />
            </TouchableOpacity>
            <Text
              style={[
                style.headerText,
                { color: settings?.themeSettings?.generalTextColor },
              ]}
            >
              {props?.screen || ''}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => console.log('Pressed first icon')}
          >
            <AntDesign
              name='wechat'
              size={24}
              color={settings?.themeSettings?.generalTextColor || '#fff'}
              style={style.rightHeader}
            />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 0,
    minHeight: Platform.OS === 'android' ? 55 : 90,
    flexDirection: 'row',
    backgroundColor: '#694fad',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  headerText: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: '#fff',
    marginLeft: 15,
  },
  leftHeader: {
    marginLeft: 15,
  },
  rightHeader: {
    marginRight: 15,
  },
})
