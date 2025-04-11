import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import API from "@/login/api";

const SHIPPING_FEE = 15000;

const PayScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { cartItems = [] } = route.params || [];
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [user, setUser] = useState({ username: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState<"visa" | "bank">("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const BANK_CODE = "VPB"; // mã ngân hàng
  const NAME_BANK = "VP Bank";
  const ACCOUNT_NUMBER = "9999261005"; // số tài khoản
  const ACCOUNT_NAME = "NGUYEN NGOC THACH"; // chủ tài khoản
  // Tính tổng
  useEffect(() => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);
    setFinalPrice(total * 1000 + SHIPPING_FEE);
  }, [cartItems]);
  const qrLink = `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NUMBER}-compact2.png?amount=${finalPrice}&addInfo=${encodeURIComponent(
    "THANH TOAN DON HANG"
  )}`;

  // Lấy thông tin người dùng từ API
  const fetchUser = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) {
        console.warn("Không tìm thấy email trong AsyncStorage");
        return;
      }

      const res = await fetch(`${API.BASEURL}/users?email=${email}`);
      const data = await res.json();

      setUser({
        username: data.username || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (err) {
      console.error("Lỗi khi lấy thông tin user theo email:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Xử lý thanh toán
  const handlePayment = async () => {
    // Validate nếu chọn Visa
    if (paymentMethod === "visa") {
      const visaRegex = /^4[0-9]{15}$/;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const cvvRegex = /^\d{3}$/;

      if (!visaRegex.test(cardNumber)) {
        Alert.alert(
          "Lỗi",
          "Số thẻ Visa không hợp lệ. Phải bắt đầu bằng số 4 và đủ 16 số."
        );
        return;
      }
      if (!cardName.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập tên chủ thẻ.");
        return;
      }
      if (!expiryRegex.test(expiry)) {
        Alert.alert("Lỗi", "Ngày hết hạn không hợp lệ. Định dạng MM/YY.");
        return;
      }

      // Check expiry not in past
      const [mm, yy] = expiry.split("/").map(Number);
      const now = new Date();
      const currentYY = now.getFullYear() % 100;
      const currentMM = now.getMonth() + 1;
      if (yy < currentYY || (yy === currentYY && mm < currentMM)) {
        Alert.alert("Lỗi", "Thẻ đã hết hạn.");
        return;
      }

      if (!cvvRegex.test(cvv)) {
        Alert.alert("Lỗi", "CVV phải gồm 3 chữ số.");
        return;
      }
    }

    // Nếu hợp lệ, tiếp tục xử lý
    Alert.alert("Xác nhận", "Bạn có chắc muốn thanh toán?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            const cartData = await AsyncStorage.getItem("cart");
            const currentCart = cartData ? JSON.parse(cartData) : [];
            const updatedCart = currentCart.filter(
              (item: any) => !cartItems.some((i: any) => i._id === item._id)
            );
            await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
            // 🔥 Gửi thông báo về API
            // 🔥 Gửi thông báo về API cho từng sản phẩm trong giỏ hàng
            const userId = await AsyncStorage.getItem("userEmail");

            for (const product of cartItems) {
              const res = await fetch(`${API.BASEURL}/notifications`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId,
                  title: "Đặt hàng thành công",
                  productName: product.name || "Sản phẩm",
                  image: product.image,
                  date: new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }),
                  quantity: product.quantity,
                }),
              });

              if (!res.ok) {
                console.warn(
                  "Không thể gửi thông báo cho sản phẩm:",
                  product.name
                );
              }
            }
            Alert.alert("Thành công", "Thanh toán thành công!");
            navigation.goBack();
          } catch (err) {
            Alert.alert("Lỗi", "Thanh toán thất bại. Vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  // Danh sách sản phẩm
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>
          {item.price.toLocaleString()}đ x {item.quantity}
        </Text>
      </View>
    </View>
  );

  // Cập nhật địa chỉ mới
  const handleAddressUpdate = () => {
    if (newAddress.trim()) {
      setUser((prev) => ({ ...prev, address: newAddress }));
      setEditModalVisible(false);
    }
  };

  return (
    <FlatList
      data={cartItems}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Xác nhận đơn hàng</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
            <Text style={styles.addressText}>
              {user.username} - {user.phone}
            </Text>
            <Text style={styles.addressText}>{user.address}</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(true)}>
              <Text style={styles.changeBtn}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
        </>
      }
      ListFooterComponent={
        <>
          {/* Tóm tắt thanh toán */}
          <View style={styles.summaryBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Tạm tính:</Text>
              <Text style={styles.value}>
                {totalPrice.toLocaleString()}.000đ
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phí vận chuyển:</Text>
              <Text style={styles.value}>{SHIPPING_FEE.toLocaleString()}đ</Text>
            </View>
            <View style={styles.rowTotal}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>
                {finalPrice.toLocaleString()}đ
              </Text>
            </View>
          </View>

          {/* Phương thức thanh toán */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor:
                    paymentMethod === "visa" ? "#007537" : "#ccc",
                  borderRadius: 8,
                }}
                onPress={() => setPaymentMethod("visa")}
              >
                <Text style={{ color: "#fff" }}>Thanh toán Visa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor:
                    paymentMethod === "bank" ? "#007537" : "#ccc",
                  borderRadius: 8,
                }}
                onPress={() => setPaymentMethod("bank")}
              >
                <Text style={{ color: "#fff" }}>Chuyển khoản</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Visa */}
          {paymentMethod === "visa" && (
            <View style={{ marginBottom: 20 }}>
              <TextInput
                placeholder="Số thẻ (16 số)"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
                style={styles.input}
              />
              <TextInput
                placeholder="Tên chủ thẻ"
                placeholderTextColor="#888"
                value={cardName}
                onChangeText={setCardName}
                style={styles.input}
              />
              <TextInput
                placeholder="Hết hạn (MM/YY)"
                placeholderTextColor="#888"
                value={expiry}
                onChangeText={setExpiry}
                style={styles.input}
              />
              <TextInput
                placeholder="CVV"
                placeholderTextColor="#888"
                keyboardType="numeric"
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
                style={styles.input}
              />
            </View>
          )}

          {/* QR nếu chọn chuyển khoản */}
          {paymentMethod === "bank" && (
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}
              >
                Quét mã QR để thanh toán
              </Text>
              <Image
                source={{ uri: qrLink }}
                style={{ width: 250, height: 250, borderRadius: 12 }}
              />
              <Text style={{ marginTop: 10, fontSize: 15 }}>
                Chủ tài khoản:{" "}
                <Text style={{ fontWeight: "bold" }}>{ACCOUNT_NAME}</Text>
              </Text>
              <Text>Ngân hàng: {NAME_BANK}</Text>
              <Text>Số tài khoản: {ACCOUNT_NUMBER}</Text>
              <Text>Nội dung: ThanhToan_{user.username}</Text>
            </View>
          )}

          {/* Nút thanh toán */}
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payText}>Thanh toán</Text>
          </TouchableOpacity>

          {/* Modal chỉnh sửa địa chỉ */}
          <Modal
            visible={editModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setEditModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Cập nhật địa chỉ
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập địa chỉ mới"
                  value={newAddress}
                  onChangeText={setNewAddress}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                    <Text style={styles.modalCancel}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAddressUpdate}>
                    <Text style={styles.modalUpdate}>Cập nhật</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      }
    />
  );
};

export default PayScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },

  addressContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  addressText: { fontSize: 14, color: "#444" },
  changeBtn: { color: "#007bff", marginTop: 5 },

  item: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  details: { flex: 1, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 14, color: "green", marginTop: 5 },

  summaryBox: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  label: { fontSize: 15, color: "#555" },
  value: { fontSize: 15, fontWeight: "600" },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#000" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#ff4d00" },

  payButton: {
    backgroundColor: "#007537",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 10,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 15,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalCancel: {
    marginRight: 20,
    color: "#777",
    fontWeight: "bold",
  },
  modalUpdate: {
    color: "#007537",
    fontWeight: "bold",
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
});
