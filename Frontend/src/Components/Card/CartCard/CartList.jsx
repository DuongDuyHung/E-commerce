import { Button, Card, CardActionArea, CardActions, CardContent, Rating, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'
import { AiFillDelete } from 'react-icons/ai'
import styles from './CartCard.module.css'

const CartList = ({ product, removeFromWishlist }) => {
    console.log('removeFromWishlist:', removeFromWishlist);
    return (
        <Card className={styles.main_cart}>
            <Link to={`/Detail/type/${product?.category}/${product?._id}`}>
                <CardActionArea className={styles.card_action} >
                    <Box className={styles.img_box}  >
                        <img alt={product?.name} loading='lazy'   src={`http://localhost:3000${product.imgURL}`} className={styles.img} />
                    </Box>
                    <CardContent>
                        <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
                            {product?.name.length > 20 ? product?.name.slice(0, 20) + '...' : product?.name}
                        </Typography>
                        <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
                                {product?.price} đồng
                            </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent:'center',
                                '& > *': {
                                    m: 1,
                                },
                            }}
                        >
                            <Button>  
                            </Button>
                          
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Link>
            <CardActions style={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
                <Tooltip title='Remove From Wishlist'>
                    <Button className='all-btn' sx={{ width: 10, borderRadius: '30px' }} variant='contained' color='error' onClick={() =>{ console.log('Removing product:', product);  removeFromWishlist(product);}}>
                        <AiFillDelete style={{ fontSize: 15 }} />
                    </Button>
                </Tooltip>
                <Typography> 
                    <Rating name="read-only" value={Math.round(product?.rating)} readOnly  precision={0.5} />
                </Typography>
            </CardActions>
        </Card>
    )
}

export default CartList
