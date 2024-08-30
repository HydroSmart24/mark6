import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface CustomBottomNavProps {
  navigation: any;
}

const CustomBottomNav: React.FC<CustomBottomNavProps> = ({ navigation }) => {
  const scaleValue = new Animated.Value(1);

  const animateScale = (toValue: number) => {
    Animated.timing(scaleValue, {
      toValue,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('DebrisMain')} 
        style={styles.navItem}
        onPressIn={() => animateScale(0.9)}
        onPressOut={() => animateScale(1)}
      >
        <MaterialCommunityIcons name="waves" size={30} color="black" />
        <Text style={styles.navText}>Quality</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('AvailableScreen')} 
        style={styles.navItem}
        onPressIn={() => animateScale(0.9)}
        onPressOut={() => animateScale(1)}
      >
        <MaterialCommunityIcons name="water" size={30} color="black" />
        <Text style={styles.navText}>Available</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Home')} 
        style={styles.homeButton}
        onPressIn={() => animateScale(0.9)}
        onPressOut={() => animateScale(1)}
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <MaterialCommunityIcons name="home" size={40} color="white" />
        </Animated.View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('OrderHistory')} 
        style={styles.navItem}
        onPressIn={() => animateScale(0.9)}
        onPressOut={() => animateScale(1)}
      >
        <MaterialCommunityIcons name="cart" size={30} color="black" />
        <Text style={styles.navText}>Buy</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('DetectScreen')} 
        style={styles.navItem}
        onPressIn={() => animateScale(0.9)}
        onPressOut={() => animateScale(1)}
      >
        <MaterialCommunityIcons name="cart-arrow-right" size={30} color="black" />
        <Text style={styles.navText}>Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width,
    height: 70,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: 'black',
  },
  homeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1E8FBB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default CustomBottomNav;
