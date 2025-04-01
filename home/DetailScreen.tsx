import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailScreen = ({ route }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(0);
  const [cart, setCart] = useState([]);
  const totalPrice = quantity * product.price;
  const navigation = useNavigation();
  const addToCart = async () => {
    try {
      let cart = await AsyncStorage.getItem("cart");
      cart = cart ? JSON.parse(cart) : [];

      // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
      const index = cart.findIndex((item) => item.id === product.id);
      if (index !== -1) {
        cart[index].quantity += 1; // Tăng số lượng nếu đã có trong giỏ hàng
      } else {
        cart.push({ ...product, quantity: 1 }); // Thêm sản phẩm mới
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      navigation.navigate("GioHang"); // Chuyển sang màn giỏ hàng
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  const isPot =
    !product.onffo && !product.status && !product.size && !product.origin;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.infor}>
        {!isPot && (
          <>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Sản Phẩm:</Text>
              <Text style={styles.infoLabel}>{product.onffo}</Text>
            </View>
          </>
        )}
        <Text style={styles.price}>{product.price}đ</Text>

        {!isPot && (
          <>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Kích cỡ</Text>
              <Text style={styles.value}>{product.size}</Text>
            </View>
            <View style={styles.underline} />

            <View style={styles.rowContainer}>
              <Text style={styles.label}>Xuất xứ</Text>
              <Text style={styles.value}>{product.origin}</Text>
            </View>
            <View style={styles.underline} />

            <View style={styles.rowContainer}>
              <Text style={styles.label}>Tình trạng</Text>
              <Text style={styles.valueStatus}>{product.status}</Text>
            </View>
            <View style={styles.underline} />
          </>
        )}

        {/* Số lượng và tạm tính */}
        <View style={styles.quantityContainer}>
          <View style={styles.quantityBox}>
            <Text style={styles.textQuantity}>Chọn {quantity} sản phẩm</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(0, quantity - 1))}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityNumber}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.textTemp}>Tạm tính</Text>
            <Text style={styles.textPrice}>
              {totalPrice.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, "$&,")}đ
            </Text>
          </View>
        </View>

        {/* Nút chọn mua */}
        <TouchableOpacity
          style={[
            styles.buyButton,
            { backgroundColor: quantity > 0 ? "#007537" : "gray" },
          ]}
          disabled={quantity === 0}
          onPress={addToCart}
        >
          <Text style={styles.buyButtonText}>Chọn Mua</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 290,
  },
  infor: {
    width: "95%",
    padding: 20,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  infoLabel: {
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: "#009245",
    marginRight: 5,
    fontSize: 14,
  },
  price: {
    fontSize: 24,
    color: "green",
    marginTop: 10,
  },
  titleContainer: {
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
  },
  underline: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
    marginTop: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: "black",
  },
  value: {
    fontSize: 16,
    color: "gray",
  },
  valueStatus: {
    fontSize: 16,
    color: "#007537",
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  quantityBox: {
    alignItems: "center",
  },
  textQuantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityNumber: {
    fontSize: 18,
    marginHorizontal: 15,
  },
  priceBox: {
    alignItems: "center",
  },
  textTemp: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textPrice: {
    fontSize: 18,
    color: "green",
    marginTop: 10,
  },
  buyButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buyButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
