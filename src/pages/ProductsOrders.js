import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Slider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import axios from "axios";

export default function ProductOrders() {
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cart, setCart] = useState({});

  const navigate = useNavigate();
  const categoryOptions = {
    "T-shirts": "t-shirt",
    Polo: "polo",
    Jeans: "jeans",
    Shirts: "shirt",
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          min_price: priceRange[0],
          max_price: priceRange[1],
          categories: selectedCategories,
        },
      });
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((cat) => cat !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const quantity = prev[product.id]?.quantity || 0;
      return {
        ...prev,
        [product.id]: {
          ...product,
          quantity: quantity + 1,
        },
      };
    });
  };

  const removeFromCart = (product) => {
    setCart((prev) => {
      const quantity = prev[product.id]?.quantity || 0;
      if (quantity <= 1) {
        const updated = { ...prev };
        delete updated[product.id];
        return updated;
      }
      return {
        ...prev,
        [product.id]: {
          ...product,
          quantity: quantity - 1,
        },
      };
    });
  };

  const total = Object.values(cart).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    const selectedItems = Object.values(cart);
    navigate("/order-details", {
      state: {
        items: selectedItems,
        total: total.toFixed(2),
      },
    });
  };

  const handleClearFilters = () => {
    setPriceRange([0, 300]);
    setSelectedCategories([]);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight="bold">
          Casual
        </Typography>
      </Box>

      {/* Main Layout */}
      <Box display="flex" gap={2} sx={{ height: "calc(100vh - 100px)" }}>
        {/* Filters */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          sx={{
            width: 200,
            height: "100%",
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box>
            <Typography fontWeight="bold" mb={2}>
              Filters
            </Typography>

            <Typography variant="subtitle2">Price</Typography>
            <Slider
              value={priceRange}
              onChange={(e, val) => setPriceRange(val)}
              valueLabelDisplay="auto"
              min={0}
              max={300}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2">Category</Typography>
            {Object.entries(categoryOptions).map(([label, value]) => (
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(value)}
                    onChange={() => handleCategoryChange(value)}
                  />
                }
                label={label}
              />
            ))}
          </Box>

          <Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "black", color: "white" }}
              onClick={fetchProducts}
            >
              Apply Filter
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>

        {/* Product Grid */}
        <Box flex={1} overflow="auto">
          <Grid container spacing={2}>
            {products.map((product) => {
              const quantity = cart[product.id]?.quantity || 0;
              return (
                <Grid item xs={12} sm={4} key={product.id}>
                  <Box
                    border="1px solid #ddd"
                    borderRadius={2}
                    p={2}
                    textAlign="center"
                  >
                    <img
                      src={product.image_url || "/placeholder.png"}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "contain",
                      }}
                    />
                    <Typography fontWeight="bold">{product.name}</Typography>
                    <Typography>${product.price}</Typography>
                    <Box
                      mt={1}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      gap={1}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => removeFromCart(product)}
                      >
                        -
                      </Button>
                      <Typography>{quantity}</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => addToCart(product)}
                      >
                        +
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Order Summary */}
        <Box
          sx={{
            width: 250,
            height: "100%",
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            overflowY: "auto",
          }}
        >
          <Typography fontWeight="bold" mb={2}>
            Order Summary
          </Typography>

          {Object.values(cart).length === 0 ? (
            <Typography variant="body2">No items selected</Typography>
          ) : (
            Object.values(cart).map((item) => (
              <Box
                key={item.id}
                display="flex"
                alignItems="center"
                gap={1}
                mb={2}
                borderBottom="1px solid #eee"
                pb={1}
              >
                <img
                  src={item.image_url || "/placeholder.png"}
                  alt={item.name}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
                <Box flexGrow={1}>
                  <Typography variant="body2" fontWeight="bold">
                    {item.name}
                  </Typography>
                  <Typography variant="caption">
                    {item.quantity} × ${item.price}
                  </Typography>
                </Box>
                <Typography fontWeight="bold">
                  ${(item.quantity * item.price).toFixed(2)}
                </Typography>
              </Box>
            ))
          )}

          <Typography mt={2} fontWeight="bold">
            Total: ${total.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "black" }}
            disabled={total === 0}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
