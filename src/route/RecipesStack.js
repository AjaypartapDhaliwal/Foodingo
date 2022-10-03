import { createStackNavigator } from '@react-navigation/stack';
import RecipesScreen from "../screens/Recipes.js";
import RecipesHelpScreen from "../components/RecipesHelp.js"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'

const Stack = createStackNavigator();
const primaryColor = '#00bfff'

export default function RecipesStack({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Recipes Page" component={RecipesScreen} options={{
        headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Recipes Help")}
          title="Info"
          color="#00cc00"
          style={{marginRight: 8}}>
          <Ionicons
            name="help-circle-outline"
            size={40}
            color={primaryColor}
          />
        </TouchableOpacity>
        ),
      }} />
      <Stack.Screen name="Recipes Help" component={RecipesHelpScreen} />
    </Stack.Navigator>
  );
}