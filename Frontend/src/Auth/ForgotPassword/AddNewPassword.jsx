import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, CssBaseline, InputAdornment, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { MdLockOutline } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-toastify'
import CopyRight from '../../Components/CopyRight/CopyRight'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

const AddNewPassword = () => {
    const { token } = useParams(); // <-- chỉ lấy token
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:3000/auth/resetpassword/${token}`, {
                password: password
            });

            toast.success("Password reset successful!", { autoClose: 500, theme: 'colored' });
            navigate('/login');
        } catch (error) {
            const msg = error.response?.data?.msg || "Reset failed";
            toast.error(msg, { autoClose: 500, theme: 'colored' });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
                    <MdLockOutline />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Enter New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                                    {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                </InputAdornment>
                            )
                        }}
                        autoFocus
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Submit
                    </Button>
                </Box>
            </Box>
            <CopyRight sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
};

export default AddNewPassword;
