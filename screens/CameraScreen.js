import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View , Dimensions} from 'react-native';

export default function CameraCompo() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();


  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.cameraContainer}>
      <Camera style={styles.fixedRatio} type={type}>
        <View >
          <TouchableOpacity onPress={toggleCameraType}>
            <Text >Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
  
}
const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio:{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    }
  }
)