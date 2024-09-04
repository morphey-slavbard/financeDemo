import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'

export default function FadeEdges(props) {
  return (
    <MaskedView
      style={props?.style}
      maskElement={
        <LinearGradient
          style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          start={{ x: props?.startX || 0.5, y: props?.startY || 1 }}
          end={{ x: props?.endX || 0.5, y: props?.endY || 0 }}
          locations={[1, 0.5]}
        />
      }
    >
      {props.children}
    </MaskedView>
  )
}
