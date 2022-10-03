import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MarketStack from "../route/MarketStack.js";
import PantryStack from "../route/PantryStack.js";
import AccountScreen from "./Account.js";
import SellingStack from '../route/SellingStack.js';
import RecipesStack from '../route/RecipesStack.js';

const Tab = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {

  const url = navigation.getParam('url');
  const name = navigation.getParam('name');
  const university = navigation.getParam('university');
  const halls = navigation.getParam('halls');
  const phoneNumber = navigation.getParam('phoneNumber');
  const diet = navigation.getParam('diet');

  const AccountSection = () => 
    <AccountScreen url={url} name={name} 
      university={university} halls={halls} 
      phoneNumber={phoneNumber} diet={diet} />

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions ={({ route }) => ({
          tabBarIcon: ({color, size }) => {
            if (route.name === 'Pantry Details') {
              return (
                <MaterialCommunityIcons
                  name="food-variant"
                  size={size}
                  color={color}
                />
              );
            } 

            else if (route.name === 'Market Place') {
              return (
                <Ionicons
                  name="basket-outline"
                  size={size}
                  color={color}
               />
              );
            } 

            else if (route.name === 'Recipes') {
               return (
                <MaterialCommunityIcons 
                  name="food-apple-outline" 
                  size={size} 
                  color={color} />
               );
            }

            else if (route.name === 'Selling') {
              return (
                <Ionicons
                  name="cash-outline"
                  size={size}
                  color={color}
                />
              );
            } 

            else if (route.name === 'Account') {
              return (
                <Ionicons
                  name="person-circle-outline"
                  size={size}
                  color={color}
                />
              );
            }

           },
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: '#00bfff',
        })}
        >

        {
          <Tab.Screen 
            name="Pantry Details" 
            options={{headerShown: false}}
            component={PantryStack}
          />
        }

        { 
          <Tab.Screen
          name="Market Place"
          options={{headerShown: false}}
          component={MarketStack}
          initialParams={{halls: halls, university: university}}
          /> 
        }

        {  
          <Tab.Screen 
          name="Selling" 
          options={{headerShown: false}}
          component={SellingStack}
          />
        }

        { 
          <Tab.Screen 
            name="Recipes" 
            options={{headerShown: false}}
            component={RecipesStack}
          />
        }
         
        {  <Tab.Screen 
          name="Account" 
          component={AccountSection}
          />
        }
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}