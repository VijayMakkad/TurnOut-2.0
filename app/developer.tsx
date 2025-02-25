import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import type React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar, Linking } from 'react-native';

const SumanImage = require('../assets/suman.jpeg');
const SuvanImage = require('../assets/suvan.jpeg');
const VijayImage = require('../assets/vijay.jpeg');

interface DeveloperDetails {
  name: string;
  status: string;
  image: any; // Change to 'any' type for local asset
  details: string;
  gitHub: string;
  linkDin: string;
}

const DeveloperCard: React.FC<DeveloperDetails> = ({
  name,
  status,
  image,
  details,
  gitHub,
  linkDin,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <TouchableOpacity
      className={`m-2 h-[380px] w-[280px] overflow-hidden rounded-lg bg-[#333] p-4 ${
        isFlipped ? 'border-2 border-[#FDB623]' : ''
      }`}
      onPress={() => setIsFlipped(!isFlipped)}>
      {!isFlipped ? (
        <View className="flex-1 items-center justify-between py-2">
          <Text className="mb-1 text-xl font-bold text-white">{name}</Text>
          <Text className="mb-2 text-sm text-[#6c757d]">{status}</Text>
          <Image source={image} className="h-[220px] w-[220px] rounded-xl" resizeMode="cover" />
          <TouchableOpacity
            className="mt-4 rounded bg-[#FDB623] px-6 py-2"
            onPress={() => setIsFlipped(true)}>
            <Text className="text-sm text-black">Details</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 items-center justify-between py-2">
          <Text className="mb-2 text-xl font-bold text-white">Details</Text>
          <Text className="px-2 text-center text-sm text-white">{details}</Text>
          <View className="mt-4 flex-row justify-center">
            <TouchableOpacity onPress={() => Linking.openURL(gitHub)}>
              <AntDesign name="github" className="mx-3 h-[50px] w-[50px]" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(linkDin)}>
              <AntDesign name="linkedin-square" className="mx-3 h-[50px] w-[50px]" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="mt-4 rounded bg-[#FDB623] px-6 py-2"
            onPress={() => setIsFlipped(false)}>
            <Text className="text-sm text-black">Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const DeveloperScreen: React.FC = () => {
  const router = useRouter();

  const developers: DeveloperDetails[] = [
    {
      name: 'Suvan GS',
      status: 'Geek',
      image: SuvanImage,
      details: 'Technical Lead',
      linkDin: 'https://www.linkedin.com/in/suman-s-7b1313211/',
      gitHub: 'https://github.com/greeenboi/',
    },
    {
      name: 'Vijay Makkad',
      status: 'Geek',
      image: VijayImage,
      details: 'Associate Technical Lead',
      linkDin: 'https://www.linkedin.com/in/vijay-makkad-1573681b3/',
      gitHub: 'https://github.com/VijayMakkad',
    },
    {
      name: 'Suman S Harshvardhan',
      status: 'Geek',
      image: SumanImage,
      details: 'Technical Member',
      linkDin: 'https://www.linkedin.com/in/suman-s-7b1313211/',
      gitHub: 'https://github.com/snugtroller',
    },
  ];

  return (
    <View className="flex-1 bg-[#333] ">
      <StatusBar barStyle="light-content" backgroundColor="#333" />
      <View className="absolute left-5 top-12 z-10 mt-5 rounded-xl bg-[#333] p-2 shadow-lg shadow-black">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" color="#FDB623" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingTop: 80,
          paddingBottom: 20,
          marginTop: 10,
        }}>
        <Text className="mb-5 text-3xl font-bold text-[#FDB623]">Our Developers</Text>
        <View className="flex-row flex-wrap justify-center px-4">
          {developers.map((dev, index) => (
            <DeveloperCard
              key={index}
              name={dev.name}
              status={dev.status}
              image={dev.image}
              details={dev.details}
              gitHub={dev.gitHub}
              linkDin={dev.linkDin}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default DeveloperScreen;
