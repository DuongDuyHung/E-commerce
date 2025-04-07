import '../Login/login.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Button, Checkbox, CssBaseline, FormControlLabel, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { MdLockOutline } from 'react-icons/md'
import { Box, Container } from '@mui/system'
import { toast } from 'react-toastify'
import CopyRight from '../../Components/CopyRight/CopyRight'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

const Register = () => {
  const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    let auth = localStorage.getItem('Authorization');
    if (auth) {
      navigate("/");
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    try {
      if (!credentials.email || !credentials.username || !credentials.password) {
        toast.error("All fields are required", { autoClose: 500, theme: 'colored' });
      }
      else if (credentials.username.length < 3) {
        toast.error("Username must be at least 3 characters long", { autoClose: 500, theme: 'colored' });
      }
      else if (emailRegex.test(credentials.email) === false) {
        toast.error("Please enter a valid email", { autoClose: 500, theme: 'colored' });
      }
      else if (credentials.password.length < 5) {
        toast.error("Password must be at least 5 characters long", { autoClose: 500, theme: 'colored' });
      }
      else {
        const sendAuth = await axios.post(`${"http://localhost:3000/auth/signup"}`, {
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
        });
        const receive = await sendAuth.data;
        if (receive.success === true) {
          toast.success("Registered Successfully", { autoClose: 500, theme: 'colored' });
          localStorage.setItem('Authorization', receive.authToken);
          navigate('/');
          console.log(receive);
        }
        else {
          toast.error("Something went wrong, Please try again", { autoClose: 500, theme: 'colored' });
          navigate('/');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error[0]?.msg || "An error occurred", { autoClose: 500, theme: 'colored' });
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs" sx={{ marginBottom: 10 }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
            <MdLockOutline />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={credentials.username}
                  onChange={handleOnChange}
                  autoComplete="username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={credentials.email}
                  onChange={handleOnChange}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                        {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                      </InputAdornment>
                    )
                  }}
                  value={credentials.password}
                  onChange={handleOnChange}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                Already have an account?
                <Link to='/login' style={{ color: '#1976d2', marginLeft: 3 }}>
                  Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <CopyRight sx={{ mt: 5 }} />
      </Container>
    </>
  );
};

export default Register;