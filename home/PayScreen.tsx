import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

const PayScreen = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("giao_hang_nhanh");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("visa_mastercard");
  const [shippingFee, setShippingFee] = useState(15000); // Mặc định phí vận chuyển là 15.000đ
  const [totalPrice, setTotalPrice] = useState(0);

  // Thêm các state để lưu các giá trị nhập vào từ người dùng
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Thêm state để lưu thông báo lỗi
  const [errors, setErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // Giả sử giá trị sản phẩm
  const cartItems = [
    { name: "Sản phẩm 1", price: 100000 },
    { name: "Sản phẩm 2", price: 200000 },
  ];

  useEffect(() => {
    // Tính tổng giá trị giỏ hàng
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(total + shippingFee); // Tổng tiền = giá trị giỏ hàng + phí vận chuyển
  }, [shippingFee]);

  const handleFormValidation = () => {
    let newErrors = { ...errors };

    if (!cardNumber) newErrors.cardNumber = "Số thẻ không được để trống";
    else newErrors.cardNumber = "";

    if (!expiryDate) newErrors.expiryDate = "Ngày hết hạn không được để trống";
    else newErrors.expiryDate = "";

    if (!cvv) newErrors.cvv = "CVV không được để trống";
    else newErrors.cvv = "";

    if (!fullName) newErrors.fullName = "Họ tên không được để trống";
    else newErrors.fullName = "";

    if (!email) newErrors.email = "Email không được để trống";
    else newErrors.email = "";

    if (!phone) newErrors.phone = "Số điện thoại không được để trống";
    else newErrors.phone = "";

    if (!address) newErrors.address = "Địa chỉ giao hàng không được để trống";
    else newErrors.address = "";

    setErrors(newErrors);

    // Kiểm tra xem tất cả các trường đã hợp lệ chưa
    const isValid = Object.values(newErrors).every((error) => error === "");
    setIsFormValid(isValid);
  };

  const handleShippingSelect = (method) => {
    if (method === "giao_hang_nhanh") {
      setShippingFee(15000); // Phí vận chuyển 15.000đ
    } else if (method === "giao_hang_cham") {
      setShippingFee(30000); // Phí vận chuyển 30.000đ
    }
    setSelectedShipping(method);
  };

  const handlePaymentSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      // Logic để xử lý thanh toán (lưu thông tin, gọi API, v.v.)
      Alert.alert("Thanh toán thành công", "Cảm ơn bạn đã mua hàng!");
    } else {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
    }
  };

  return (
    <ScrollView style={styles.container}>
       

      {/* Thông tin khách hàng */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Thông tin khách hàng</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ tên"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            handleFormValidation();
          }}
        />
        {errors.fullName ? (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            handleFormValidation();
          }}
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            handleFormValidation();
          }}
        />
        {errors.phone ? (
          <Text style={styles.errorText}>{errors.phone}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ giao hàng"
          value={address}
          onChangeText={(text) => {
            setAddress(text);
            handleFormValidation();
          }}
        />
        {errors.address ? (
          <Text style={styles.errorText}>{errors.address}</Text>
        ) : null}
      </View>

      {/* Phương thức vận chuyển */}
      <View style={styles.shippingContainer}>
        <Text style={styles.label}>Phương thức vận chuyển</Text>
        <TouchableOpacity
          style={[
            styles.shippingOption,
            selectedShipping === "giao_hang_nhanh" && styles.selectedOption,
          ]}
          onPress={() => handleShippingSelect("giao_hang_nhanh")}
        >
          <Text style={styles.shippingText}>Giao hàng nhanh - 15.000đ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.shippingOption,
            selectedShipping === "giao_hang_cham" && styles.selectedOption,
          ]}
          onPress={() => handleShippingSelect("giao_hang_cham")}
        >
          <Text style={styles.shippingText}>Giao hàng chậm - 30.000đ</Text>
        </TouchableOpacity>
      </View>

      {/* Hình thức thanh toán */}
      <View style={styles.paymentMethodContainer}>
        <Text style={styles.label}>Hình thức thanh toán</Text>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === "visa_mastercard" &&
              styles.selectedOption,
          ]}
          onPress={() => handlePaymentSelect("visa_mastercard")}
        >
          <Text style={styles.paymentText}>Thẻ VISA/MASTERCARD</Text>
        </TouchableOpacity>
      </View>

      {/* Tạm tính và tổng tiền */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryText}>
            Tổng tiền giỏ hàng: {totalPrice - shippingFee}đ
          </Text>
          <Text style={styles.summaryText}>Phí vận chuyển: {shippingFee}đ</Text>
          <Text style={styles.summaryText}>Tổng cộng: {totalPrice}đ</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, !isFormValid && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.checkoutText}>Tiến hành thanh toán</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
  shippingContainer: {
    marginBottom: 20,
  },
  shippingOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#f0f0f0",
  },
  shippingText: {
    fontSize: 16,
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  paymentOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  paymentText: {
    fontSize: 16,
  },
  summaryContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 20,
  },
  summaryDetails: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedOption: {
    backgroundColor: "#D3F9D8",
  },
});

export default PayScreen;
