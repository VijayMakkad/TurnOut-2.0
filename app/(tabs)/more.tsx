'use client';

import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Animated, View, Text, Pressable, StatusBar, Image } from 'react-native';

const options: {
  name: string;
  icon: any;
  route: '/history' | '/attendance' | '/options' | '/developer';
}[] = [
  { name: 'History', icon: 'clockcircle', route: '/history' },
  { name: 'Attendance', icon: 'user', route: '/attendance' },
  { name: 'Settings', icon: 'setting', route: '/options' },
  { name: 'Developers', icon: 'codesquare', route: '/developer' },
];

export default function QRGeneratorScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const animationValue = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => setIsVisible(true), 100);
    }, [])
  );

  useEffect(() => {
    if (isVisible) {
      Animated.spring(animationValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, animationValue]);

  const animatedStyle = {
    transform: [
      {
        scale: animationValue,
      },
    ],
  };

  return (
    <View className="flex-1 bg-[#333]">
      <StatusBar barStyle="light-content" />
      <View className="mb-5 h-[20%] justify-end px-6 pb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-white">TurnOut</Text>
          <Pressable
            className="rounded-full bg-[#444] p-3 active:bg-[#555]"
            onPress={() => router.push('/scanner')}>
            <AntDesign name="qrcode" color="#FDB623" size={24} />
          </Pressable>
        </View>
      </View>

      <View className="relative flex-1 px-6 pt-4">
        <Image
          source={require('../../assets/Vector 11.png')}
          className="absolute bottom-0 h-[400px] w-[500px] px-0 pt-0"
          style={{
            transform: [{ scaleX: -1 }],
            opacity: 0.9,
          }}
          resizeMode="contain"
        />
        {options.map(({ name, icon: Icon, route }, index) => (
          <Animated.View
            key={name}
            style={[
              animatedStyle,
              {
                opacity: animationValue,
                transform: [
                  {
                    translateY: animationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50 * (index + 1), 0],
                    }),
                  },
                  { scale: animationValue },
                ],
              },
            ]}
            className="mb-4 mt-5">
            <Pressable
              className="rounded-md bg-[#444] shadow-lg active:bg-[#555]"
              onPress={() => router.push(route)}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}>
              <View className="flex-row items-center p-4">
                <View className="mr-4 rounded-full p-3">
                  <AntDesign name={Icon} color="#FDB623" size={24} />
                </View>
                <Text className="flex-1 text-lg font-semibold text-white">{name}</Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
