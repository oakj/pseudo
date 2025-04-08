import { useState, useRef } from "react"
import { Animated, Dimensions } from "react-native"

const { height } = Dimensions.get("window")

export function useDrawer() {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const drawerAnimation = useRef(new Animated.Value(0)).current

  const showDrawer = () => {
    setDrawerVisible(true)
    Animated.timing(drawerAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const hideDrawer = () => {
    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDrawerVisible(false)
    })
  }

  const translateY = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  })

  return {
    drawerVisible,
    translateY,
    showDrawer,
    hideDrawer,
  }
}