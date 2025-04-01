import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const GioHangScreen = () => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    const isAnyItemSelected = Object.values(selectedItems).some(
      (isSelected) => isSelected
    );
    Animated.timing(animatedValue, {
      toValue: isAnyItemSelected ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedItems]);

  const getCart = async () => {
    const cartData = await AsyncStorage.getItem("cart");
    const parsedCart = cartData ? JSON.parse(cartData) : [];
    setCart(parsedCart);
    const sel = {};
    parsedCart.forEach((item) => (sel[item.id] = false));
    setSelectedItems(sel);
  };

  const deleteAllItems = async () => {
    setCart([]);
    await AsyncStorage.removeItem("cart");
    setSelectedItems({});
    setModalVisible(false);
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const updateQuantity = async (id, delta) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity < 1 ? 1 : newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalSummary = cart.reduce(
    (acc, item) => {
      if (selectedItems[item.id]) {
        acc.totalPrice += item.price * item.quantity;
        acc.totalQuantity += item.quantity;
      }
      return acc;
    },
    { totalPrice: 0, totalQuantity: 0 }
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity onPress={() => toggleSelect(item.id)}>
              <MaterialIcons
                name={
                  selectedItems[item.id]
                    ? "check-box"
                    : "check-box-outline-blank"
                }
                size={24}
                color="black"
              />
            </TouchableOpacity>

            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}đ</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, -1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.deleteButton}
                >
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận xoá tất cả đơn hàng?</Text>
            <Text style={styles.modalText}>
              Thao tác này sẽ không thể khôi phục.
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={deleteAllItems}
            >
              <Text style={styles.confirmButtonText}>Đồng ý</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Phần tạm tính với animation */}
      <Animated.View
        style={[
          styles.summaryContainer,
          {
            opacity: animatedValue,
            height: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 100], // Khi không có sản phẩm, chiều cao là 0
            }),
            overflow: "hidden",
          },
        ]}
      >
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryText}>
            Tạm tính:{" "}
            {totalSummary.totalPrice
              .toFixed(0)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
            .000đ
          </Text>

          <Text style={styles.summaryText}>
            Số lượng: {totalSummary.totalQuantity}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("Pay")}
        >
          <Text style={styles.checkoutText}>Tiến hành thanh toán</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default GioHangScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  item: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  image: { width: 80, height: 80, borderRadius: 10, marginHorizontal: 10 },
  details: { flex: 1 },
  name: { fontSize: 18, fontWeight: "bold" },
  price: { fontSize: 16, color: "green", marginVertical: 5 },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: { fontSize: 20, fontWeight: "bold" },
  quantity: { marginHorizontal: 10, fontSize: 16 },
  deleteButton: { marginLeft: 10 },
  summaryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  summaryDetails: { flexDirection: "row", justifyContent: "space-between" },
  summaryText: { fontSize: 16, fontWeight: "bold" },
  checkoutButton: {
    marginTop: 10,
    backgroundColor: "#007537",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 14, color: "gray", marginBottom: 20 },
  confirmButton: {
    backgroundColor: "#007537",
    paddingVertical: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  confirmButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  cancelText: {
    color: "black",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
