import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    TextField,
    Typography
  } from '@mui/material'
  import React, { useState } from 'react'
  import { IoBagCheckOutline } from 'react-icons/io5'
  
  const OrderSummary = ({ proceedToCheckout, total, shippingCoast }) => {
    const [quantity, setQuantity] = useState(1)
  
    const handleQuantityChange = (e) => {
      const value = Math.max(1, parseInt(e.target.value) || 1)
      setQuantity(value)
    }
  
    const subtotal = total - shippingCoast
  
    return (
      <Card
        sx={{
          maxWidth: 500,
          mx: 'auto',
          borderRadius: 3,
          boxShadow: 8,
          mt: 4,
          px: 2,
          py: 3
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            🧾 Order Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
  
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
  
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight={500}>
                Subtotal
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{subtotal * quantity}đồng</Typography>
            </Grid>
  
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight={500}>
                Shipping
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{shippingCoast}đồng</Typography>
            </Grid>
  
            <Grid item xs={6}>
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" fontWeight={700}>
                {subtotal * quantity + shippingCoast}đồng
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
  
        <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<IoBagCheckOutline />}
            color="primary"
            onClick={() => proceedToCheckout(quantity)}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Checkout
          </Button>
        </CardActions>
      </Card>
    )
  }
  
  export default OrderSummary
  