import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import TopNavbar from '../../components/TopNavbar'

const window = Dimensions.get('window')
const deviceWidth = window.width

export default function Article(props) {
  const route = useRoute()
  const [loaded, setLoaded] = useState(false)
  const [article, setArticle] = useState(null)
  const [cta, setCta] = useState(null)
  let count = Math.floor(Math.random() * 1000 + 1)

  useEffect(() => {
    if (route?.params?.article) {
      setArticle(route?.params?.article)
      setLoaded(true)
    }

    if (route?.params?.cta) {
      setCta(route?.params?.cta)
    }
  }, [route?.params?.article])

  if (!loaded) {
    return <ActivityIndicator size='large' color='#694fad' />
  }

  return (
    <View style={props.theme.innerContainers}>
      <TopNavbar
        screen={
          article?.name?.length > 25
            ? article?.name?.substring(0, 25) + '...' || ''
            : article?.name
        }
        navigation={props?.navigation}
      />

      <ScrollView
        style={style.articleContainer}
        contentContainerStyle={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {article?.image_url && (
          <Image
            source={{ uri: article?.image_url }}
            style={style.articleImage}
            resizeMode='cover'
          />
        )}
        <View style={{ padding: 20 }}>
          <Text style={style.articleSP}>
            This Article has been viewed {count} times in the last 24 hours
          </Text>
          <Text style={style.articleContent}>{article?.description}</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  articleSP: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 10,
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: 10,
    alignItems: 'center',
  },
  articleContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: '#fcfcfc',
  },
  articleTitle: {
    fontFamily: 'Roboto_medium',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 20,
  },
  articleContent: {
    fontFamily: 'Roboto',
    fontSize: 16,
    marginBottom: 20,
  },
  articleImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  articleActionButton: {
    width: deviceWidth - 50,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  articleCTAText: {
    fontFamily: 'Roboto_medium',
    fontSize: 18,
    color: '#fff',
  },
})
