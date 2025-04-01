import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HomeScreen from "./HomeScreen";
import DetailScreen from "./DetailScreen";
import SearchScreen from "./SearchScreen";
import CartScreen from "./CartScreen";
import PotScreen from "./PotScreen";
import TreeScreen from "./TreeScreen";
import ToolsSecreen from "./ToolsSecreen";
import PayScreen from "./PayScreen";
import LoginScreen from "../login/Login";
import Register from "../login/Register";

const NotificationScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Notifications Screen</Text>
  </View>
);

const UserScreen = () => (
  <View style={styles.screenContainer}>
    <Text>User Screen</Text>
  </View>
);

// Stack cho Home
const Stack = createStackNavigator();
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Detail"
      component={DetailScreen}
      options={({ route, navigation }) => ({
        title: route.params?.product?.name || "Chi Tiết",
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingLeft: 15 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("GioHang")}
            style={{ paddingRight: 15 }}
          >
            <MaterialIcons name="shopping-cart" size={24} color="black" />
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="GioHang"
      component={CartScreen}
      options={{
        title: "Giỏ hàng",
        headerTitleAlign: "center",
      }}
    />
    {/* Thêm màn hình Cây Trồng */}
    <Stack.Screen
      name="TreeScreen"
      component={TreeScreen}
      options={({ navigation }) => ({
        title: "Cây Trồng",
        headerTitleAlign: "center",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("GioHang")}
            style={{ paddingRight: 15 }}
          >
            <MaterialIcons name="shopping-cart" size={24} color="black" />
          </TouchableOpacity>
        ),
      })}
    />

    <Stack.Screen
      name="PotScreen"
      component={PotScreen}
      options={({ navigation }) => ({
        title: "CHẬU CÂY TRỒNG",
        headerTitleAlign: "center",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("GioHang")}
            style={{ paddingRight: 15 }}
          >
            <MaterialIcons name="shopping-cart" size={24} color="black" />
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="ToolsSecreen"
      component={ToolsSecreen}
      options={({ navigation }) => ({
        title: "CHẬU CÂY TRỒNG",
        headerTitleAlign: "center",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("GioHang")}
            style={{ paddingRight: 15 }}
          >
            <MaterialIcons name="shopping-cart" size={24} color="black" />
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="Pay"
      component={PayScreen}
      options={{ title: "Thanh toán" }}
    />
  </Stack.Navigator>
);

// Stack cho Search
const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SearchScreen" // Đổi tên để tránh trùng lặp
      component={SearchScreen}
      options={({ navigation }) => ({
        headerTitle: () => <Text>Tìm kiếm</Text>,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingLeft: 15 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerTitleAlign: "center",
      })}
    />
  </Stack.Navigator>
);

// Tab Navigator
const Tab = createBottomTabNavigator();
const AppHome = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === "Home") iconName = "home";
        else if (route.name === "Search") iconName = "search";
        else if (route.name === "Notifications") iconName = "notifications";
        else if (route.name === "User") iconName = "person";
        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#007AFF",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5 },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Search" component={SearchStack} />
    <Tab.Screen name="Notifications" component={NotificationScreen} />
    <Tab.Screen name="User" component={UserScreen} />
  </Tab.Navigator>
);
// Stack cho Login & Register
const RootStack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={Register} />
        <RootStack.Screen name="AppHome" component={AppHome} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    width: 250,
  },
});

export default App;
