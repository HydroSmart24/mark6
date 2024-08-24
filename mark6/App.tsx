import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/index';
import DebrisMainScreen from './Screens/Debris/DebrisMain';
import DetectScreen from './Screens/Debris/DetectScreen';


type RootStackParamList = {
  index: undefined;
  DebrisMain: undefined;
  DetectScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="index">
        <Stack.Screen name="index" component={HomeScreen} />
        <Stack.Screen name="DebrisMain" component={DebrisMainScreen} />
        <Stack.Screen name="DetectScreen" component={DetectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
