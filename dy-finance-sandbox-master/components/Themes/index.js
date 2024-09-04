import { Dimensions, StyleSheet } from 'react-native'

const window = Dimensions.get('window')
const deviceWidth = window.width

export const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  innerContainers: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  linearContainer: {
    width: deviceWidth,
    height: 240,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 60,
    overflow: 'hidden',
  },
  header: {
    width: deviceWidth - 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: -50,
  },
  headerText: {
    fontFamily: 'Roboto_bold',
    fontSize: 20,
    color: '#f0edf6',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
})
