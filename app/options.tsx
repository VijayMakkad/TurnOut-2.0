import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import type React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Switch } from 'react-native';

const SettingsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#333]">
      <StatusBar barStyle="light-content" backgroundColor="#333" />
      <View className="absolute left-4 top-14 z-10 mt-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-lg bg-[#222] p-3 shadow-lg">
          <AntDesign name="left" color="#FDB623" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 100 }}>
        <Text className="mb-8 pb-4 text-center text-4xl font-bold text-[#FDB623]">Settings</Text>

        <View className="space-y-4">
          <SettingItem
            icon={<AntDesign name="shake" size={24} color="#FDB623" />}
            title="Vibrate"
            description="Vibration when scan is done."
            controlElement={<CustomSwitch defaultChecked />}
          />
        </View>
        <View className="mt-3 space-y-4">
          <SettingItem
            icon={<AntDesign name="bells" size={24} color="#FDB623" />}
            title="Beep"
            description="Beep when scan is done."
            controlElement={<CustomSwitch defaultChecked={false} />}
          />
        </View>

        <Text className="mb-4 mt-8 text-3xl font-bold text-[#FDB623]">Support</Text>

        <View className="overflow-hidden rounded-2xl bg-[#222]">
          <SupportItem
            icon={<AntDesign name="star" size={24} color="#FDB623" />}
            title="Rate Us"
            description="Your best reward to us."
          />
          <View className="h-[0.5px] bg-gray-600" />
          <SupportItem
            icon={<AntDesign name="sharealt" size={24} color="#FDB623" />}
            title="Share"
            description="Share app with others."
          />
          <View className="h-[0.5px] bg-gray-600" />
          <SupportItem
            icon={<AntDesign name="Safety" size={24} color="#FDB623" />}
            title="Privacy Policy"
            description="Follow our policies that benefits you."
          />
        </View>
      </ScrollView>
    </View>
  );
};

interface ItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SettingItemProps extends ItemProps {
  controlElement: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, description, controlElement }) => {
  return (
    <View className="flex-row items-center rounded-xl bg-[#222] px-4 py-4">
      <View className="mr-3">{icon}</View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-white">{title}</Text>
        <Text className="text-sm text-gray-400">{description}</Text>
      </View>
      {controlElement}
    </View>
  );
};

const SupportItem: React.FC<ItemProps> = ({ icon, title, description }) => {
  return (
    <TouchableOpacity className="flex-row items-center px-4 py-4 active:bg-[#2a2a2a]">
      <View className="mr-3">{icon}</View>
      <View>
        <Text className="text-lg font-semibold text-white">{title}</Text>
        <Text className="text-sm text-gray-400">{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CustomSwitch: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked = true }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  return (
    <Switch
      value={isChecked}
      onValueChange={setIsChecked}
      trackColor={{ false: '#444', true: '#FDB623' }}
      thumbColor="#ffffff"
      ios_backgroundColor="#444"
      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
    />
  );
};

export default SettingsScreen;
