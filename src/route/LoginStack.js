import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Login from '../screens/Login';
import Registration from '../screens/Registration';
import Home from '../screens/Home';

const screens = {

  Login: {
    screen: Login,
    navigationOptions: {headerShown: false}
  },

  Registration: {
    screen: Registration,
    navigationOptions: {headerShown: false}
  },
  
  Home: {
    screen: Home,
    navigationOptions: {headerShown: false}
  }

}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);