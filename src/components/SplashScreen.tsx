import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const orangeOpacity = React.useRef(new Animated.Value(0)).current;
  const whiteOpacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // First fade in
    Animated.timing(orangeOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      // First fade orange to white
      Animated.timing(orangeOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Then fade white to transparent
        Animated.timing(whiteOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(onAnimationComplete);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [orangeOpacity, whiteOpacity, onAnimationComplete]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.whiteLayer, { opacity: whiteOpacity }]} />
      <Animated.View style={[styles.orangeLayer, { opacity: orangeOpacity }]}>
        <View style={styles.logoContainer}>
          <Svg width={200} height={200} viewBox="0 0 200 200">
            <G>
              <Path d="M 155.55 85.453 C 160.55 86.153 161.7 89.5 162.3 94 C 162.7 97.1 162.7 100.2 162.6 103.4 C 162.4 109 162.6 114.6 162.5 120.2 C 162.5 122.2 162 124.1 161.1 125.8 C 159.1 129.6 156 132.2 151.8 133.4 C 150.4 133.8 149 134 147.6 134 C 146.2 134 144.8 134.9 143.4 134 C 143.2 133.9 142.8 134 142.6 134 C 139.7 133.7 136.8 134.1 133.8 134 C 120 133.8 106.1 134 92.3 134 C 78.5 134 75 133.9 66.4 134 C 63.6 134 60.8 133.7 58 134 C 57.8 134 57.7 134 57.5 134 C 56.2 134.4 55 134.2 53.6 134 C 52.1 133.8 50.6 133.8 49.2 133.5 C 42.9 132.2 38.5 127.3 37.8 120.5 C 37.4 116.9 37.6 113.3 37.6 109.7 C 37.6 105.3 37.6 100.8 37.7 96.4 C 37.7 95.1 37.9 93.7 38.2 92.4 C 38.5 90.8 39.1 89.3 40.3 88.1 C 41.2 87.1 42.3 86.3 43.5 86 C 45.1 85.6 46.7 84.8 48.6 85.2 C 50.9 85.7 53 86.2 54.8 87.7 C 58.3 90.6 59.5 94.5 60.1 98.8 C 60.6 102.4 60.7 106.1 60.6 109.7 C 60.6 111.8 61 112.2 63.1 112.2 L 137 112.2 C 139.7 112.2 139.8 112.2 139.8 109.4 C 139.8 104.7 139.8 100 141 95.4 C 142.2 90.4 145.2 87 150.2 85.6 C 151.2 85.3 154.3 85.4 154.8 85.4 L 155.55 85.453 Z" fill="#fff" stroke="#fff"/>
              <Path d="M55.5,134.5c0,1.2-.1,2.5-.1,3.7,0,1.8,1.2,2.9,2.9,2.9,1,0,2.1,0,3.1,0,1.6,0,2.2-.6,2.5-2.3.2-1.4,0-2.9.1-4.3" fill="#fff" stroke="#fff"/>
              <Path d="M136,134.5c0,1.3,0,2.6,0,3.8,0,1.9,1.3,2.7,2.8,2.8,1,0,2.1,0,3.1,0,1.6,0,2.4-.8,2.6-2.4.2-1.4,0-2.8.1-4.2" fill="#fff" stroke="#fff"/>
              <G>
                <Path d="M70.4,65.4c1.5,1.6-.6,5.5-1.1,7.7-.5,2.7-.3,4.8.2,7.4,0,0,0,.2,0,.3-.7,3.9,3.6,8.2,3.9,10.9.5,3.7-3.9,4.7-6.6,3.1-5.9-3.5-3.3-9.3,2-13.6-.2-.4-.8-.6-1.2-.8-4.8-2.5-8.1-6.3-4.5-12.4,1.4-2.5,5.1-4.8,7.2-2.6h0Z" fill="#fff" stroke="#fff"/>
                <Path d="M95.2,72.1c.4-1.4.8-3,1.3-4.3,1-2.3,3.8-5.6,2.7-7.6-2.4-4.4-11.4,2.7-9,9,.7,1.8,2.5,3.3,3.1,5.2-3.2,2.8-6.7,6.1-4.5,9.9,1.5,2.6,6.4,3.5,6.5-.5,0-2.8-2.1-6.1-.5-9.7v-.2c0-.7.2-1.3.4-2h0Z" fill="#fff" stroke="#fff"/>
                <Path d="M 116.807 72.495 C 117.507 71.095 118.1 70.6 119.1 69.3 C 120.2 67.9 123.2 65.9 121.5 64.2 C 119.4 62 115.2 64.9 113.9 67.2 C 112.2 70.1 113.5 72.1 113.9 74.8 C 112.2 76.9 109.3 77.8 108.9 80.6 C 108.6 82.7 110.6 87.1 113.5 85.1 C 115 84.1 114.7 80.4 115 78.7 C 115.3 77.2 115.9 74.7 116.6 73.3 L 116.807 72.495 Z" fill="#fff" stroke="#fff"/>
                <Path d="M131.3,78.3c1.2,1,6.1,3.7,6.7,4.4.6.7.6,1.2-1,.8-.8-.2-4.9-2.5-5.9-3.2" fill="#fff" stroke="#fff"/>
                <Path d="M131.3,80.7c0,0,0-.6,0-.8,0,0,0,0,0-.1,0-.9-.3-1.7,0-2.7.8-2.5,5.1-4.4,7-2.9,2.7,2-1.8,3.6-3.2,4.4-2.2,1.3-1.3,1.3-1.9,3.4,0,0,0,.1,0,.2-.3,1.2-1,4.7-1.4,5.5-.6,1.1-2,1.2-2.8.5-.8-.7-1.1-3.4-.7-4.5.6-1.7,2.7-2.5,2.9-2.9h0Z" fill="#fff" stroke="#fff"/>
                <Path d="M 106.6 72.2 C 107.2 70.7 107.8 69.2 108.3 68.1 C 109.5 66 113.1 62.8 111.3 60.9 C 108.2 57.7 102 63.7 102.2 68 C 102.2 70.2 104.3 71.7 104 73.8 L 103.8 74 C 100.8 77.3 97.4 79.5 100.1 83.6 C 101.3 85.4 104.4 86.3 105.3 83.4 C 106 81.3 104.5 76.6 106 74 L 106 73.8 C 106.2 73.3 106.4 72.7 106.6 72.2 Z" fill="#fff" stroke="#fff"/>
                <Path d="M82.9,74.7c0,0,0-.1,0-.2.2-1.9.5-3.8,1.2-5.7.8-2.2,3.3-5.2,1.2-7-2.3-2-5.9.5-7.3,2.9-3,5.1-.9,8.8,3.1,11.4.1.3-.2.5-.3.7,0,0-.1.2-.2.3-1.5,2.8-4.2,5-4.1,8.3,0,3.7,6.8,6.8,8.3,2.5.5-1.4-1.7-5.5-2-7.3-.2-1.4-.2-2.8-.1-4.2h0c0-.7,0-1.2.1-1.8h0Z" fill="#fff" stroke="#fff"/>
                <Path d="M124.8,76.4c.6-1.1,1.3-2.1,2.2-3.1.9-1.1,3.4-2.7,2-4.1-1.8-1.7-5.3.5-6.4,2.4-1.4,2.3-.4,3.9,0,6h0c-1.4,1.7-3.8,2.4-4.2,4.6-.3,1.7,1.4,5.2,3.8,3.6,1.3-.8,1-3.7,1.2-5.1.2-1.2.8-3.2,1.4-4.3h0Z" fill="#fff" stroke="#fff"/>
                <Path d="M58.3,83.9c0,0,25.6-11.3,42.1-10.7c18.9.7,31.2,5.7,31.6,5.8c0.4,0.1,0,1.3-0.5,1.3c-0.1,0-17.1-6.6-35-5.8c-17.5.9-36.2,11.1-37.4,11c-0.8-0.1-1.2-1.8-0.8-1.8c0.4,0,0-0.2,0,0Z" fill="#fff" stroke="#fff" strokeWidth="2"/>
              </G>
            </G>
          </Svg>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F34F23',
  },
  whiteLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F34F23',
    zIndex: 1,
  },
  orangeLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F34F23',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 