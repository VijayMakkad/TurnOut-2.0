import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from 'expo-camera';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { supabase } from '../../utils/supabase';

const closeImg = require('../../assets/close.png');
const flashImg = require('../../assets/flash.png');
const flipImg = require('../../assets/flip.png');
const scanImg = require('../../assets/qr-code-scan.png');

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const [flash, setFlash] = useState<FlashMode>('off');
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const isScanning = useRef(false);

  const markAttendance = async (qrData: string) => {
    if (loading) return;

    try {
      setLoading(true);
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleString();
      // setScanTime(formattedTime);

      console.log('Attempting to mark attendance for ID:', qrData);

      // First check if the registration exists and is approved
      const { data: existingReg, error: fetchError } = await supabase
        .from('eventsregistrations')
        .select('*')
        .eq('id', qrData)
        .single();

      console.log('Full registration data:', existingReg);

      if (fetchError) {
        console.error('Fetch Error:', fetchError);
        Alert.alert('Error', 'Registration not found. Please try again.');
        setScanned(false);
        return;
      }

      if (!existingReg) {
        Alert.alert('Error', 'Registration not found. Please check the QR code and try again.');
        setScanned(false);
        return;
      }

      // Check if registration is approved - using ACCEPTED enum value
      if (existingReg.is_approved !== 'ACCEPTED') {
        Alert.alert('Not Approved', 'This registration has not been approved');
        setScanned(false);
        return;
      }

      if (existingReg.attendance === 'Present') {
        Alert.alert('Already Marked', 'Attendance has already been marked for this registration');
        setScanned(false);
        return;
      }

      // Try a simple update first
      console.log('Attempting simple attendance update...');
      const { data: simpleUpdate, error: simpleError } = await supabase
        .from('eventsregistrations')
        .update({ attendance: 'Present' })
        .match({ id: qrData, is_approved: 'ACCEPTED', attendance: 'Absent' })
        .select();

      console.log('Simple update result:', simpleUpdate, simpleError);

      if (simpleError) {
        console.error('Simple update error:', simpleError);
        Alert.alert('Error', 'Failed to update attendance');
        setScanned(false);
        return;
      }

      // Double-check the update worked
      const { data: checkData, error: checkError } = await supabase
        .from('eventsregistrations')
        .select('attendance, details')
        .eq('id', qrData)
        .single();

      console.log('Verification data:', checkData);

      if (checkError || !checkData) {
        console.error('Verification error:', checkError);
        Alert.alert('Error', 'Failed to verify update');
        setScanned(false);
        return;
      }

      if (checkData.attendance !== 'Present') {
        // Try one more time with a different approach
        console.log('Trying alternative update method...');
        const { error: altError } = await supabase.rpc('mark_attendance', {
          registration_id: qrData,
        });

        if (altError) {
          console.error('Alternative update failed:', altError);
          Alert.alert('Error', 'Failed to mark attendance');
          setScanned(false);
          return;
        }
      }

      // Final verification
      const { data: finalCheck } = await supabase
        .from('eventsregistrations')
        .select('attendance')
        .eq('id', qrData)
        .single();

      if (!finalCheck || finalCheck.attendance !== 'Present') {
        Alert.alert('Error', 'Failed to mark attendance after multiple attempts');
        setScanned(false);
        return;
      }
      Alert.alert(
        'Success',
        `Attendance marked successfully for ${existingReg.event_title} at ${formattedTime}`,
        [
          {
            text: 'View History',
            onPress: () =>
              router.push({
                pathname: '/history',
                params: {
                  qrLink: qrData,
                  scanTime: formattedTime,
                  eventTitle: existingReg.event_title,
                },
              }),
          },
          {
            text: 'Scan Another',
            onPress: () => {
              setScanned(false);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      console.error('Error processing attendance:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = async (scanningResult: BarcodeScanningResult) => {
    if (isScanning.current || scanned) return;
    const { data } = scanningResult;
    isScanning.current = true;
    setScanned(true);
    await markAttendance(data);
    isScanning.current = false;
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="mb-4 text-center">Camera permission is required</Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="rounded-lg bg-yellow-400 px-6 py-3">
          <Text className="font-bold text-black">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {!image && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          facing={facing}
          enableTorch={flash === 'on'}
          ratio="16:9"
        />
      )}

      <View className="absolute flex h-full w-full items-center justify-center">
        <View className="absolute h-[250px] w-[250px] rounded-lg border-[2px] border-transparent" />
        <View className="absolute left-[25%] top-[35%] h-[50px] w-[50px] rounded-tl-xl border-l-[10px] border-t-[10px] border-l-yellow-400 border-t-yellow-400" />
        <View className="absolute right-[25%] top-[35%] h-[50px] w-[50px] rounded-tr-xl border-r-[10px] border-t-[10px] border-r-yellow-400 border-t-yellow-400" />
        <View className="absolute bottom-[35%] left-[25%] h-[50px] w-[50px] rounded-bl-xl border-b-[10px] border-l-[10px] border-b-yellow-400 border-l-yellow-400" />
        <View className="absolute bottom-[35%] right-[25%] h-[50px] w-[50px] rounded-br-xl border-b-[10px] border-r-[10px] border-b-yellow-400 border-r-yellow-400" />
      </View>

      <View
        className="absolute top-12 flex w-full flex-row items-center justify-between px-4 py-2"
        style={{ backgroundColor: '#333333', borderRadius: 50 }}>
        <TouchableOpacity
          className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400"
          onPress={() => {
            setScanned(false);
          }}
          disabled={loading}>
          <ExpoImage
            source={scanImg}
            style={{ height: 30, width: 30, opacity: loading ? 0.5 : 1 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400"
          onPress={toggleCameraFacing}
          disabled={loading}>
          <ExpoImage
            source={flipImg}
            style={{ height: 30, width: 30, opacity: loading ? 0.5 : 1 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400"
          onPress={toggleFlash}
          disabled={loading}>
          <ExpoImage
            source={flashImg}
            style={{ height: 30, width: 30, opacity: loading ? 0.5 : 1 }}
          />
        </TouchableOpacity>
      </View>

      {image && (
        <View className="flex h-full w-full items-center justify-center">
          <ExpoImage source={{ uri: image }} style={{ width: '100%', height: '105%' }} />
          <TouchableOpacity
            className="absolute right-5 top-5 rounded-full border-yellow-400 bg-gray-200 p-2"
            onPress={() => {
              setImage(null);
              setScanned(false);
            }}
            disabled={loading}>
            <ExpoImage
              source={closeImg}
              style={{ height: 50, width: 50, opacity: loading ? 0.5 : 1 }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
