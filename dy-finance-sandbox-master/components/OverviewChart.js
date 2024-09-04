import React from 'react'
import { View, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Helper } from './Helper'

export default function OverviewChart(props) {
  return (
    <View style={[style.container, { width: props?.style?.width || '100%' }]}>
      {props?.data?.map((item, index) => (
        <View
          key={`spending_item_${index}`}
          style={[
            style.section,
            {
              width: `${item.value}%`,
              backgroundColor: item.color ? item.color : Helper.randomColor(),
            },
          ]}
        >
          {item.value >= 10 ? (
            <FontAwesome name={item.icon} size={14} color='#fff' />
          ) : null}
        </View>
      ))}
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    height: 25,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 0.25,
    borderColor: '#c2c2c2',
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderLeftWidth: 0.45,
    borderLeftColor: '#fff',
  },
})
