import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

export default function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items: initialItems = [], total = 0 } = location.state || {};

  const [items, setItems] = useState(initialItems);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 15.0;
  const tax = (subtotal * 0.05).toFixed(2);
  const orderTotal = (
    parseFloat(subtotal) +
    parseFloat(shipping) +
    parseFloat(tax)
  ).toFixed(2);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const incrementQuantity = (id) => {
    const item = items.find((i) => i.id === id);
    handleQuantityChange(id, item.quantity + 1);
  };

  const decrementQuantity = (id) => {
    const item = items.find((i) => i.id === id);
    if (item.quantity > 1) {
      handleQuantityChange(id, item.quantity - 1);
    }
  };

  const handleInputChange = (id, value) => {
    const number = parseInt(value, 10);
    if (!isNaN(number) && number > 0) {
      handleQuantityChange(id, number);
    }
  };

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token"); 

      const orderPayload = {
        products: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/orders",
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );

      alert("Order placed successfully!");
      navigate("/order-success"); 
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #eee",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            izam
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Button variant="text" onClick={() => navigate("/products")}>
            Products
          </Button>{" "}
        </Box>

        <Typography variant="body1">¥</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          p: 3,
          gap: 3,
        }}
      >
        {/* Products Section */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Your Order
          </Typography>

          {items.length === 0 ? (
            <Typography>No items found.</Typography>
          ) : (
            items.map((item) => (
              <Box key={item.id} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    mb: 2,
                  }}
                >
                  <img
                    src={item.image_url || "/placeholder.png"}
                    alt={item.name}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {item.name}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ my: 1 }}>
                      ${item.price}
                    </Typography>
                    <Typography>Stock: {item.stock || 25}</Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography sx={{ mr: 2 }}>Quantity:</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: "32px" }}
                        onClick={() => decrementQuantity(item.id)}
                      >
                        -
                      </Button>
                      <TextField
                        value={item.quantity}
                        size="small"
                        sx={{
                          width: "60px",
                          mx: 1,
                          "& .MuiInputBase-input": { textAlign: "center" },
                        }}
                        onChange={(e) =>
                          handleInputChange(item.id, e.target.value)
                        }
                        inputProps={{
                          style: { textAlign: "center" },
                          type: "number",
                          min: 1,
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: "32px" }}
                        onClick={() => incrementQuantity(item.id)}
                      >
                        +
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Divider />
              </Box>
            ))
          )}
        </Box>

        {/* Order Summary Section */}
        <Box
          sx={{
            flex: 1,
            border: "1px solid #eee",
            borderRadius: "8px",
            p: 3,
            height: "fit-content",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Order Summary
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Subtotal</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Shipping</Typography>
              <Typography>${shipping.toFixed(2)}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Tax</Typography>
              <Typography>${tax}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Order Date</Typography>
            <Typography>{formattedDate}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${orderTotal}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "black",
              color: "white",
              py: 1.5,
              "&:hover": { backgroundColor: "#333" },
            }}
            onClick={placeOrder}
          >
            Place the order
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
