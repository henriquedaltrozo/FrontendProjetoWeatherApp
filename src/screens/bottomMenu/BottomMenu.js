import React from 'react';
import {Alert} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Profile from './Profile';
import Home from './Home';
import Search from './Search';

const Tab = createBottomTabNavigator();

const HomeIcon = ({color, size}) => (
  <MaterialCommunityIcons name="home" color={color} size={size} />
);

const ProfileIcon = ({color, size}) => (
  <MaterialCommunityIcons name="account-circle" color={color} size={size} />
);

const SearchIcon = ({color, size}) => (
  <MaterialCommunityIcons name="magnify" color={color} size={size} />
);

const LogoutIcon = ({color, size}) => (
  <MaterialCommunityIcons name="logout" color={color} size={size} />
);

export default function BottomMenu({navigation}) {
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('TOKEN');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.log(error);
      Alert.alert('Erro ao sair');
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {backgroundColor: '#fff'},
        tabBarActiveTintColor: '#4F4F4F',
        tabBarInactiveTintColor: '#000',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: 'Procurar',
          tabBarIcon: SearchIcon,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ProfileIcon,
        }}
      />

      <Tab.Screen
        name="Leave"
        component={Home}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            logout();
          },
        }}
        options={{
          tabBarLabel: 'Sair',
          tabBarIcon: LogoutIcon,
        }}
      />
    </Tab.Navigator>
  );
}
