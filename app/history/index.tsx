import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

import dlt from '../../assets/delete.png';
import qr_logo from '../../assets/qr_logo.png';

interface QRData {
  link: string;
  scanTime: string;
}

export default function HistoryScreen() {
  const [qrDataList, setQrDataList] = useState<QRData[]>([]);
  const { qrLink, scanTime } = useLocalSearchParams();
  const router = useRouter();

  const loadQrData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('qrDataList');
      if (storedData) {
        setQrDataList(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load QR data:', error);
    }
  };

  const saveQrData = async (data: QRData[]) => {
    try {
      await AsyncStorage.setItem('qrDataList', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save QR data:', error);
    }
  };

  useEffect(() => {
    loadQrData();
  }, []);

  useEffect(() => {
    if (qrLink && scanTime && !qrDataList.some((item) => item.link === qrLink)) {
      const updatedData = [...qrDataList, { link: qrLink as string, scanTime: scanTime as string }];
      setQrDataList(updatedData);
      saveQrData(updatedData);
    }
  }, [qrLink, scanTime, qrDataList]);

  const handleDelete = (indexToDelete: number) => {
    const updatedData = qrDataList.filter((_, index) => index !== indexToDelete);
    setQrDataList(updatedData);
    saveQrData(updatedData);
  };

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Something went wrong. Unable to open the link.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open the link.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#FDB623" size={24} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>History</Text>

      {/* Scrollable List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {qrDataList.length === 0 ? (
          <Text style={styles.noDataText}>No QR codes scanned yet.</Text>
        ) : (
          qrDataList.map((item, index) => (
            <View key={index} style={styles.qrItem}>
              <Image source={qr_logo} style={styles.qrLogo} />
              <View style={styles.qrDetails}>
                <TouchableOpacity onPress={() => handleOpenLink(item.link)}>
                  <Text style={styles.qrLink} numberOfLines={1}>
                    {item.link}
                  </Text>
                  <Text style={styles.qrTime}>Scanned At: {item.scanTime}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleDelete(index)}>
                <Image source={dlt} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#333',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 8,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    marginTop: 50,
    color: '#FDB623',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    padding: 5,
  },
  noDataText: {
    color: '#D9D9D9',
    marginTop: 20,
    textAlign: 'center',
  },
  qrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    backgroundColor: '#303030',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    height: 60,
    paddingHorizontal: 10,
  },
  qrLogo: {
    height: 33,
    width: 33,
  },
  qrDetails: {
    flex: 1,
    marginLeft: 10,
  },
  qrLink: {
    color: '#D9D9D9',
    fontSize: 17,
  },
  qrTime: {
    color: '#A4A4A4',
    fontSize: 11,
    marginTop: 5,
  },
  deleteIcon: {
    height: 24,
    width: 24,
  },
});
