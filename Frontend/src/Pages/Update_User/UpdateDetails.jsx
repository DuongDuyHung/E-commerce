import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle, AiFillDelete, AiOutlineFileDone } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import styles from './Update.module.css'
import { toast } from 'react-toastify'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { TiArrowBackOutline } from 'react-icons/ti';

import { Transition } from '../../Constants/Constant'
import CopyRight from '../../Components/CopyRight/CopyRight'


const UpdateDetails = () => {
    const [userData, setUserData] = useState([])
    const [openAlert, setOpenAlert] = useState(false);
    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        userState: '',
         address: '',
    phoneNumber: ''
    })
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    let navigate = useNavigate()
    useEffect(() => {
        setProceed ? getUserData() : navigate('/')
    }, [])
    const getUserData = async () => {
        try {
            const userId = localStorage.getItem('userId');
                console.log('userId', userId);
            const { data } = await axios.get(`http://localhost:3000/users/${userId}`, {
                headers: {
                    'Authorization': authToken
                }
            })
            userDetails.username = data.data.username
            userDetails.email = data.data.email
            userDetails.userState = data.data.userState
            userDetails.address = data.data.address;
userDetails.phoneNumber = data.data.phoneNumber;
            setUserData(data);

        } catch (error) {
            toast.error("Something went wrong", { autoClose: 500, theme: 'colored' })
        }
    }
    const handleOnchange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!userDetails.username && !userDetails.email && !userDetails.userState) {
                toast.error("Please Fill the all Fields", { autoClose: 500, theme: 'colored' })
            }
            else {
                const userId = localStorage.getItem('userId');
                console.log('userId', userId);
                const { data } = await axios.put(`http://localhost:3000/users/${userId}`, userDetails, {
                    headers: {
                        'Authorization': authToken
                    }
                });
                if (data.success === true) {
                    toast.success("Updated Successfully", { autoClose: 500, theme: 'colored' })
                    getUserData()
                }
                else {
                    toast.error("Something went wrong", { autoClose: 500, theme: 'colored' })
                }
            }
        }
        catch (error) {
            toast.error(error.response.data, { autoClose: 500, theme: 'colored' })
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (!password.currentPassword && !password.newPassword) {
                toast.error("Please Fill the all Fields", { autoClose: 500, theme: 'colored' });
            } else if (password.currentPassword.length < 5) {
                toast.error("Please enter valid password", { autoClose: 500, theme: 'colored' });
            } else if (password.newPassword.length < 5) {
                toast.error("Please enter password with more than 5 characters", { autoClose: 500, theme: 'colored' });
            } else {
                const userId = localStorage.getItem('userId');
                const { data } = await axios.post(`http://localhost:3000/auth/change_password`, {
                    userId: userId,  // <-- Thêm userId từ localStorage
                    currentPassword: password.currentPassword,
                    newPassword: password.newPassword,
                }, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    },
                });
                toast.success(data.message, { autoClose: 500, theme: 'colored' });
                setPassword(password.currentPassword = "", password.newPassword = "");
            }
        } catch (error) {
            toast.error(error.response.data.message, { autoClose: 500, theme: 'colored' });
        }
    };
    

    const deleteAccount = async () => {
        try {
            const deleteUser = await axios.delete(`${process.env.REACT_APP_DELETE_USER_DETAILS}/${userData._id}`, {
                headers: {
                    'Authorization': authToken
                }
            });
            toast.success("Account deleted successfully", { autoClose: 500, theme: 'colored' })
            localStorage.removeItem('Authorization');
            sessionStorage.removeItem('totalAmount');
            navigate("/login")
        } catch (error) {
            toast.error(error.response.data, { autoClose: 500, theme: 'colored' })
        }
    }

    return (
        <>
            <Container sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: 10 }}>
                <Typography variant='h6' sx={{ margin: '30px 0', fontWeight: 'bold', color: '#1976d2' }}>Personal Information</Typography>
                <form noValidate autoComplete="off" className={styles.checkout_form} onSubmit={handleSubmit} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Username" name='username' value={userDetails.username || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Email" name='email' value={userDetails.email || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField label="State" name='userState' value={userDetails.userState || ''} onChange={handleOnchange} variant="outlined" fullWidth />
                        </Grid>
                        <Grid item xs={12}>
    <TextField
        label="Address"
        name='address'
        value={userDetails.address || ''}
        onChange={handleOnchange}
        variant="outlined"
        fullWidth />
</Grid>
<Grid item xs={12}>
    <TextField
        label="Phone Number"
        name='phoneNumber'
        value={userDetails.phoneNumber || ''}
        onChange={handleOnchange}
        variant="outlined"
        fullWidth />
</Grid>
                    </Grid>
                    <Container sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 5 }}>
                        <Button variant='contained' endIcon={<TiArrowBackOutline />} onClick={() => navigate(-1)} >Back</Button>
                        <Button variant='contained' endIcon={<AiOutlineFileDone />} type='submit'>Save</Button>
                    </Container>
                </form >

                <Typography variant='h6' sx={{ margin: '20px 0', fontWeight: 'bold', color: '#1976d2' }}>Reset Password</Typography>
                <form onSubmit={handleResetPassword}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <TextField
                                label="Current Password"
                                name='currentPassword'
                                type={showPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                                            {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                        </InputAdornment>
                                    )
                                }}
                                value={password.currentPassword || ''}
                                onChange={(e) => setPassword({ ...password, [e.target.name]: e.target.value })}
                                variant="outlined"
                                fullWidth />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                label="New Password"
                                name='newPassword'
                                type={showNewPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" onClick={() => setShowNewPassword(!showNewPassword)} sx={{ cursor: 'pointer' }}>
                                            {showNewPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                        </InputAdornment>
                                    )
                                }}
                                value={password.newPassword || ''}
                                onChange={(e) => setPassword({ ...password, [e.target.name]: e.target.value })}
                                variant="outlined"
                                fullWidth />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: "25px 0", width: '100%' }}>
                        <Button variant='contained' color='primary' endIcon={<RiLockPasswordLine />} type='submit'>Reset</Button>
                    </Box>
                </form>

                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: "25px 0", width: '100%' }}>
                    <Typography variant='h6'>Delete Your Account?</Typography>
                    <Button variant='contained' color='error' endIcon={<AiFillDelete />} onClick={() => setOpenAlert(true)}>Delete</Button>
                </Box>
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenAlert(false)}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
                        <DialogContentText style={{ textAlign: 'center' }} id="alert-dialog-slide-description">
                            Are you sure to delete your account?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAlert(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={deleteAccount} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </>
    )
}

export default UpdateDetails
