import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function Home() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  const dragY = useSharedValue(0);
  const dragOpacity = useSharedValue(1);
  const blackBoxHeight = useSharedValue(0);

  // Animate the entry height of the black section
  useEffect(() => {
    blackBoxHeight.value = withSpring(300); // Target height
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
    opacity: dragOpacity.value,
  }));

  const animatedBlackBoxStyles = useAnimatedStyle(() => ({
    height: blackBoxHeight.value, // Animate height
  }));

  return (
    <View className="flex-1 items-center justify-between bg-[#FDB623]">
      {/* QR Code Section */}
      <MotiView
        className="flex-1 items-center justify-center"
        from={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 10 }}>
        <Image
          source={require('../assets/Group 10 (1).png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </MotiView>

      {/* Animated Bottom Black Box */}
      <Animated.View
        style={[
          animatedBlackBoxStyles, // Apply animated height styles
          {
            backgroundColor: '#333333',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.7,
            shadowRadius: 10,
            elevation: 10,
            paddingTop: 20,
            paddingBottom: 20,
            width: '100%',
          },
        ]}>
        {/* Drag Handle */}
        <Animated.View
          style={[
            {
              backgroundColor: 'white',
              width: 100,
              height: 5,
              borderRadius: 10,
              marginBottom: 30,
              borderWidth: 2,
              borderColor: '#fff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            },
            animatedStyles,
          ]}
        />

        {/* Title & Description */}
        <Text className="mt-2 text-center text-lg font-bold text-white">Get Started</Text>
        <Text className="mt-2 px-4 text-center text-sm text-white opacity-80">
          Go and enjoy our features for free and make your life easy with us.
        </Text>

        {/* Button */}
        <AnimatePresence>
          {showButton && (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 10 }}>
              <TouchableOpacity
                className="mt-12 flex-row items-center rounded-xl bg-[#FDB623] px-[86px] py-3"
                activeOpacity={0.8}
                onPress={() => router.push('/more')}>
                <Text className="mr-2 font-bold text-black">Let's Start</Text>
                <Text className="text-lg text-black">→</Text>
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>
      </Animated.View>

      {/* Trigger Button Visibility */}
      <View className="absolute bottom-10" onLayout={() => setShowButton(true)} />
    </View>
  );
}
