import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import TopNavbar from '../../../components/TopNavbar'
import { useSelector, useDispatch } from 'react-redux'
import { updateSettings } from '../../../actions'
import { Dropdown } from 'react-native-element-dropdown'

export default function Settings(props) {
  const deviceWidth = Dimensions.get('window').width
  const settings = useSelector((state) => state.settings)
  const [id, setId] = useState(settings?.cookies?.dyid || '')
  const [serverId, setServerId] = useState(settings?.cookies?.dyid_server || '')
  const [session, setSession] = useState(settings?.cookies?.session?.dy || '')
  const [apiKeyValue, setApiKeyValue] = useState(settings?.apiKey || '')
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

  const updateCookies = () => {
    const cookies = {
      dyid: id,
      dyid_server: serverId,
      session: {
        dy: session,
      },
    }
    dispatch(updateSettings({ key: 'cookies', value: cookies }))
    dispatch(updateSettings({ key: 'apiKey', value: apiKeyValue }))
    dispatch(updateSettings({ key: 'apiHost', value: regionValue }))
    dispatch(
      updateSettings({ key: 'apiCollectHost', value: regionValueCollectionUrl })
    )
  }

  return (
    <View style={props.theme.innerContainers}>
      <TopNavbar screen='Settings' navigation={props?.navigation} />

      <KeyboardAvoidingView
        style={{ flexGrow: 1 }}
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
          <View style={style.fieldsContainer}>
            <Text style={[style.fieldTitle]}>User ID</Text>
            <TextInput
              style={style.field}
              placeholder='Enter User ID'
              keyboardType='phone-pad'
              placeholderTextColor='rgba(0, 0, 0, 0.6)'
              defaultValue={id}
              maxLength={20}
              onChangeText={(value) => setId(value)}
            />
          </View>

          <View style={style.fieldsContainer}>
            <Text style={[style.fieldTitle]}>Server ID</Text>
            <TextInput
              style={style.field}
              placeholder='Enter Server ID'
              keyboardType='phone-pad'
              placeholderTextColor='rgba(0, 0, 0, 0.6)'
              defaultValue={serverId}
              maxLength={20}
              onChangeText={(value) => setServerId(value)}
            />
          </View>

          <View style={style.fieldsContainer}>
            <Text style={[style.fieldTitle]}>Session ID</Text>
            <TextInput
              style={style.field}
              placeholder='Enter Session ID'
              keyboardType='phone-pad'
              placeholderTextColor='rgba(0, 0, 0, 0.6)'
              defaultValue={session}
              maxLength={32}
              onChangeText={(value) => setSession(value)}
            />
          </View>

          <View style={style.fieldsContainer}>
            <Text style={[style.fieldTitle]}>API Key</Text>
            <TextInput
              style={style.field}
              placeholder='Enter API Key'
              keyboardType='default'
              placeholderTextColor='rgba(0, 0, 0, 0.6)'
              defaultValue={apiKeyValue}
              maxLength={70}
              onChangeText={(value) => setApiKeyValue(value)}
            />
          </View>

          <View style={style.fieldsContainer}>
            <Text style={[style.fieldTitle]}>Section Region</Text>
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
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[
            style.updateBtn,
            {
              width: deviceWidth - 50,
              backgroundColor: settings?.themeSettings?.headerColor,
            },
          ]}
          onPress={() => updateCookies()}
        >
          <Text
            style={[
              style.updateBtnText,
              { color: settings?.themeSettings?.generalTextColor },
            ]}
          >
            Update settings
          </Text>
        </TouchableOpacity>
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
  updateBtn: {
    backgroundColor: '#fff',
    padding: 10,
    alignSelf: 'center',
    marginBottom: 135,
    alignItems: 'center',
  },
  updateBtnText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#000',
  },
  fieldTitle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  dropdown: {
    margin: 0,
    height: 45,
    width: '100%',
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
})
