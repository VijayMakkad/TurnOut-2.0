//something
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import jsQR from 'jsqr';
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';

import closeImg from '../../assets/close.png';
import flashImg from '../../assets/flash.png';
import flipImg from '../../assets/flip.png';
import imgImg from '../../assets/image.png';
import scanImg from '../../assets/qr-code-scan.png';

export default function Home() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const [qrLink, setQrLink] = useState('');
  const [flash, setFlash] = useState('off');
  const router = useRouter();
  const [scanTime, setScanTime] = useState('');
  const [scanned, setScanned] = useState(false);

  const isScanning = useRef(false); // Use useRef to track scan status

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      scanQRCodeFromImage(uri);
    }
  };

  const scanQRCodeFromImage = async (uri: any) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        setQrLink(qrCode.data);
        router.push({ pathname: '/history', params: { qrLink: qrCode.data } });
      } else {
        alert('No QR code found in the image.');
      }
    };
  };

  if (!permission) {
    return <View className="flex-1" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center">We need your permission to show the camera</Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: '',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#FFD700',
            marginTop: 15,
          }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (isScanning.current) return; // Prevent multiple scans
    isScanning.current = true; // Set scanning state to true

    const currentTime = new Date();
    const formattedTime = `${currentTime.toLocaleDateString()} ${currentTime.toLocaleTimeString()}`;
    setScanTime(formattedTime);

    Alert.alert(
      'QR Code Scanned',
      `QR code with data "${data}" has been scanned at ${formattedTime}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setScanned(true);
            isScanning.current = false; // Reset scanning state after alert
            router.push({
              pathname: '/history',
              params: { qrLink: data, scanTime: formattedTime },
            });
          },
        },
      ]
    );
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const closeCamera = () => {
    setScanned(false);
  };

  const closeImage = () => {
    setImage(null);
  };

  const toggleFlash = () => {
    setFlash((currentFlash: any) => (currentFlash === 'off' ? 'torch' : 'off'));
  };

  return (
    <View className="flex-1">
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417'],
        }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        facing={facing}
        flashMode={flash}
      />

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
          onPress={closeCamera}>
          <Image source={scanImg} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400"
          onPress={toggleCameraFacing}>
          <Image source={flipImg} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400"
          onPress={toggleFlash}>
          <Image source={flashImg} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400"
          onPress={pickImage}>
          <Image source={imgImg} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
      </View>

      {image && (
        <View className="flex h-full w-full items-center justify-center">
          <Image source={{ uri: image }} style={{ width: '100%', height: '105%' }} />
          <TouchableOpacity
            className="absolute right-5 top-5 rounded-full border-yellow-400 bg-gray-200 p-2"
            onPress={closeImage}>
            <Image source={closeImg} style={{ height: 50, width: 50 }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
