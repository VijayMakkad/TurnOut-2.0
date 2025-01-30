import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function History() {
  const router = useRouter();
  const { qrLink } = useLocalSearchParams(); // Get qrLink from query params

  const [students, setStudents] = useState([
    { regNo: 'RA2211003010663', color: 'red' },
    { regNo: 'RA2211003010686', color: 'red' },
    { regNo: 'RA2211003010660', color: 'red' },
    { regNo: 'RA2211003010661', color: 'red' },
  ]);

  // Load attendance from AsyncStorage on component mount
  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const storedStudents = await AsyncStorage.getItem('students');
        if (storedStudents) {
          console.log('Loaded from AsyncStorage:', storedStudents); // Debugging
          setStudents(JSON.parse(storedStudents));
        }
      } catch (error) {
        console.error('Error loading student data from AsyncStorage:', error);
      }
    };

    loadAttendance();
  }, []);

  // Handle QR code scan if qrLink changes
  useEffect(() => {
    if (qrLink) {
      console.log('QR Link received:', qrLink); // Debugging
      handleQrScan(qrLink);
    }
  }, [qrLink]);

  // Handle QR code scan and mark attendance
  const handleQrScan = async (scannedRegNo: string) => {
    const formattedRegNo = scannedRegNo.trim().toUpperCase(); // Normalize input
    console.log('Formatted Registration Number:', formattedRegNo); // Debugging

    const studentIndex = students.findIndex(
      (student) => student.regNo.toUpperCase() === formattedRegNo
    );

    if (studentIndex !== -1) {
      if (students[studentIndex].color === 'green') {
        Alert.alert('Already Marked', 'This student is already marked as present.');
      } else {
        const updatedStudents = [...students];
        updatedStudents[studentIndex].color = 'green'; // Mark as present
        setStudents(updatedStudents);
        await saveAttendance(updatedStudents);
        Alert.alert('Attendance Marked', `Marked ${formattedRegNo} as present.`);
      }
    } else {
      Alert.alert(
        'No Match',
        'The scanned QR code does not match any student registration number.'
      );
    }
  };

  // Toggle attendance status manually
  const toggleAttendance = async (index: number) => {
    const updatedStudents = students.map((student, i) =>
      i === index ? { ...student, color: student.color === 'red' ? 'green' : 'red' } : student
    );
    setStudents(updatedStudents);
    await saveAttendance(updatedStudents);
  };

  // Save updated attendance to AsyncStorage
  const saveAttendance = async (updatedStudents: typeof students) => {
    try {
      console.log('Saving to AsyncStorage:', updatedStudents); // Debugging
      await AsyncStorage.setItem('students', JSON.stringify(updatedStudents));
    } catch (error) {
      console.error('Error saving student data to AsyncStorage:', error);
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
      <Text style={styles.title}>Attendance</Text>

      {/* Student List */}
      {students.map((student, index) => (
        <TouchableOpacity
          key={student.regNo}
          onPress={() => toggleAttendance(index)}
          style={[
            styles.studentItem,
            { backgroundColor: student.color === 'green' ? '#34D399' : '#F87171' },
          ]}>
          <Text style={styles.studentText}>{student.regNo}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
    alignItems: 'center',
    padding: 16,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: '#333333',
    borderRadius: 5,
    zIndex: 10,
  },
  title: {
    marginTop: 100,
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FDB623',
    textAlign: 'center',
  },
  studentItem: {
    width: '80%',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  studentText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
