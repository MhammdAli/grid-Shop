import { Button, Checkbox, Container, FormControl,CircularProgress, Grid, ListItemIcon, ListItemText, MenuItem, Select, TextField, Typography , Box , Avatar, FormHelperText} from '@mui/material';
import axios from 'axios';
import React,{useState} from 'react';
import AdminLayout from '../../../components/adminLayout';
import SectionSplitter from "../../../components/sectionSplitter";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { green, red } from '@mui/material/colors';
import { connect } from '../../../config/dbConn';
import { getSession } from '../../../auth/session';
import { decode } from 'jsonwebtoken';
import { CheckPermission, PERMISSIONS } from '../../../middlewares/hasPermission';
import Notifier,{NOTIFICATION_TYPE} from "../../../components/Notification" 
const Products = () => {
 
   
    const [selectStockNames, setSelectStockNames] = useState([]);

    const isAllSelected =
    selectStockNames.length > 0 && selectStockNames.length === selectStockNames.length;
    const handleChange = (event) => {
       const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setSelectStockNames(selectStockNames.length === selectStockNames.length ? [] : selectStockNames);
            return;
        }
        setSelectStockNames(value);
    };

    const [categories , setCategories] = React.useState([]);
    const [brands , setBrands] = React.useState([]);
    const [branches , setBranches] = React.useState([]); 
    const [errors,setErrors] = React.useState({}); 
    const [addDetails , setAddDetails] = React.useState(['']) 
    const [alert,setAlert] = React.useState({message : null , type : null});
    const [selectedMainCategory , setSelectedMainCategory] = React.useState("");
    const [selectedSubCategory , setSelectedSubCategory] = React.useState("");
    const [selectedBrand , setBrand] = React.useState("");
    const [loading,setLoading] = React.useState(false);

    const [productImage , setProductImage] = React.useState('');
    const [productName , setProductName] = React.useState('');
    const [slugName , setSlugName] = React.useState('');
    const [description , setDescription] = React.useState();
    const [price , setPrice] = React.useState(0);
    const [discount , setDiscount] = React.useState(0);

    function clearInputs(){  
        setErrors([]);
        setAddDetails([''])
        setSelectedMainCategory("")
        setSelectedSubCategory("")
        setBrand('')
        setSelectStockNames([]);
        setDescription('')
        setPrice(0)
        setDiscount(0)
        setProductImage(null)
        setProductName('')
        setSlugName('')
    }
    function handleBrand({target}){ 
        setBrand(target.value)
    }
    function handleMainCategory({target}){ 
        setSelectedMainCategory(target.value)
    }

    function handleSubCategory({target}){ 
        setSelectedSubCategory(target.value)
    }
 
    function AddProduct(event){
        event.preventDefault();

        setLoading(true) 
        const stocks = selectStockNames.reduce((agg,stockName)=>{
            agg.push({
                stockName,
                countInStock : parseInt(event.target[stockName]?.value) || 0
            }) 
            return agg;

        },[])
        
        const formData = new FormData()
        formData.append("name" , productName)
        formData.append("slugName" , slugName)
        formData.append("description",description)
        formData.append("discount",discount)
        formData.append("mainCategory",selectedMainCategory);
        formData.append("subCategory" , selectedSubCategory)
        formData.append("price",price);
        formData.append("brand",selectedBrand)
        formData.append("stockNames",JSON.stringify(stocks))
        formData.append("countInStock",300)
        formData.append("ItemDetails",JSON.stringify(addDetails))
        if(productImage) formData.append("avatar",productImage)


        axios.post("/api/products",formData)
        .then(()=>{
            clearInputs();
            setAlert({message : "Product added successfuly",type : NOTIFICATION_TYPE.SUCCESS})
            setLoading(false);
        })
        .catch((err)=>{
   
            const data = err.response.data
            setLoading(false) 
            if(data.name === "FILE_NOT_ACCEPTED") return setErrors({image : data.message})
            setErrors(Object.keys(data).reduce((agg,field)=>{
                agg[field] = data[field]?.message
                return agg;
            },{}))

            
        })

    }
   
    React.useState(()=>{
 
        if(typeof AbortController !== "undefined"){
            const controllerOne = new AbortController();
            const controllerTwo = new AbortController();
            const controllerThree = new AbortController();
            const CancelFirstRequest = controllerOne.signal;
            const CancelSecondRequest = controllerTwo.signal;
            const CancelThirdRequest = controllerThree.signal;
            const endPoints = [
                axios.get("http://localhost:3000/api/categories",{signal : CancelFirstRequest}),
                axios.get("http://localhost:3000/api/brands",{signal : CancelSecondRequest}),
                axios.get("http://localhost:3000/api/branches",{signal : CancelThirdRequest})
            ]

            axios.all(endPoints)
            .then(
                axios.spread((res1 , res2 , res3)=>{ 
                    setCategories(res1.data)
                    setBrands(res2.data)
                    setBranches(res3.data)
                })
            )
            

            return ()=>{
                controllerOne.abort();
                controllerTwo.abort();
                controllerThree.abort();
            }
        }
    },[]);


    function changeInputDetails(index,event){
        const values = [...addDetails];
        values[index] = event.target.value
        setAddDetails(values); 
    }

    function changeProductNameHandler({target}){
          setProductName(target.value)
    } 

    function changeSlugNameHandler({target}){
        setSlugName(target.value)
    } 
    function changeDescriptionHandler({target}){
        setDescription(target.value)
    }

    function changePriceHandler({target}){
        setPrice(target.value)
    }

    function changeDiscountHandler({target}){
        setDiscount(target.value)
    }

    function addMoreDetails(){
        
        if(addDetails.length < 6)
            setAddDetails([
                ...addDetails,
                ''
            ])
        else 
        setAlert({message : 'you cant add more than 6 fields',type : NOTIFICATION_TYPE.ERROR})
    }

    function deleteDetails(index){  
        
        if(addDetails.length > 1) {
               const values = [...addDetails]
               values.splice(index,1)
               setAddDetails(values)
        } 
        else 
          setAlert({message : 'You must keep at least 1 field',type : NOTIFICATION_TYPE.ERROR})
    }

    function closeAlert(){
        setAlert({message : null , type : null})
    }

    function chooseImageHandler({target}){
        setProductImage(target.files[0])
    }
    return (
        <AdminLayout Title="Add Product">
             <Notifier open={!!(alert?.message)} message={alert?.message} type={alert.type} onClose={closeAlert} duration={2000}/>
            <Container>
                <SectionSplitter title="Add Products" sx={{mb : 3}}/>
                <form onSubmit={AddProduct} >
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>Product Name</Typography>
                           <TextField onChange={changeProductNameHandler} value={productName} name="productName" error={!!errors?.name} helperText={errors?.name || ""} variant="outlined" size='small' placeholder='product Name' fullWidth/>
                        </Grid>
                        <Grid item md={6}  xs={12}>
                           <Typography sx={{mb : 1}}>Slug Name</Typography>
                           <TextField onChange={changeSlugNameHandler} value={slugName} name="slugName" error={!!errors?.slugName} helperText={errors?.slugName || ""} variant="outlined" size='small' placeholder='Slug Name' fullWidth/> 
                        </Grid>
                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>Description</Typography>
                           <TextField onChange={changeDescriptionHandler} value={description} name="description" error={!!errors?.description} helperText={errors?.description || ""} variant="outlined" size="small" multiline rows={4} placeholder='Description' fullWidth/>
                        </Grid> 
                        <Grid item md={6} xs={12}> </Grid>

                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>price</Typography>
                           <TextField onChange={changePriceHandler} value={price} name="price" error={!!errors?.price} helperText={errors?.price || ""} variant="outlined" type="number" size="small"  placeholder='price' fullWidth/>
                        </Grid> 
                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>discount</Typography>
                           <TextField onChange={changeDiscountHandler} value={discount} name="discount" error={!!errors?.discount} helperText={errors?.discount || ""} variant="outlined" type="number" size="small"  placeholder='discount' fullWidth/>
                        </Grid> 

                        <Grid item md={6} xs={12}>
                            <Typography sx={{mb : 1}}>Main Category</Typography>
                            <TextField select size="small" error={!!(errors["category.main"])} helperText={errors["category.main"] || ''} fullWidth onChange={handleMainCategory} value={selectedMainCategory }>
                                {categories.map((category,index)=>{
                                        return (
                                            <MenuItem value={category.mainCategory} key={index}>{category.mainCategory}</MenuItem>  
                                        )
                                    })

                                }                    
                            </TextField>
                             
                        </Grid> 

                        <Grid item md={6} xs={12}>
                            <Typography sx={{mb : 1}}>sub Category</Typography> 
                            <TextField select size="small" fullWidth onChange={handleSubCategory} value={selectedSubCategory || ""}>
                                 {categories.map((category,index)=>{
                                        return (
                                            <MenuItem value={category.subCategory} key={index}>{category.subCategory}</MenuItem>  
                                        )
                                  })

                                }                    
                            </TextField>
                        </Grid> 

                        <Grid item md={6} xs={12}>
                            <Typography sx={{mb : 1}} >Brand</Typography>
                            <TextField select  size="small"  error={!!errors?.brand} helperText={errors?.brand || ""} fullWidth onChange={handleBrand} value={selectedBrand || ""}>
                           
                            {brands.map(({brand},index)=>{
                                        return (
                                            <MenuItem value={brand} key={index}>{brand}</MenuItem>  
                                        )
                                   })

                                }   
                                                   
                            </TextField>
                            
                        </Grid> 

                    <Grid item md={6} xs={12}> </Grid>

                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth size="small">
                            <Typography sx={{mb : 1}}>Stocks</Typography> 
                            <Select 
                                multiple 
                                value={selectStockNames}
                                onChange={handleChange}
                                renderValue={(selected) => selected.join(", ")}
                            >
                                <MenuItem
                                   value="all" 
                                >
                                <ListItemIcon>
                                    <Checkbox 
                                        checked={isAllSelected}
                                        indeterminate={
                                            selectStockNames.length > 0 && selectStockNames.length < selectStockNames.length
                                        }
                                    />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Select All"
                                /> 
                                </MenuItem>
 
                                {branches.map(({branchName},index) => (
                                <MenuItem key={index} value={branchName || ""}>
                                    <ListItemIcon>
                                    <Checkbox checked={selectStockNames.indexOf(branchName) > -1} />
                                    </ListItemIcon>
                                    <ListItemText primary={branchName} />
                                </MenuItem>
                                ))}

                            </Select>
                            <FormHelperText error={!!errors?.stocks}>{errors?.stocks || ""}</FormHelperText>
                        </FormControl>

                        <Grid container sx={{my : 2}}> 

                           {selectStockNames.map((stockName,index)=>{
                               return (
                                <Grid item key={index} xs={5} sx={{mx : 1}}>
                                   <Typography>
                                       {stockName}
                                   </Typography>
                                   <TextField inputProps={{name : stockName}} size="small" fullWidth type="number" placeholder={`how many item do you have in ${stockName}`}></TextField>
                                </Grid> 
                               )
                           })

                           }

                        </Grid>
                    </Grid>
 

                    <Grid item md={6} xs={12}>
                        <Typography sx={{mb:1}}>Product Image</Typography> 
                        <TextField 
                            type="file"
                            variant="outlined" margin="normal" fullWidth size="small" 
                            name="productImage" 
                            onChange={chooseImageHandler}
                            sx={{m:0}}
                            error={!!errors?.image} helperText={errors?.image || ''}
                        /> 
                    </Grid>

                    <Grid item xs={12}>
                        <FormHelperText error={!!errors?.ItemDetails}>{errors?.ItemDetails || ''}</FormHelperText>
                        <Typography sx={{mb:1}}>Product Details</Typography>
                            
                            {addDetails.map((value,index)=>{
                                return ( 
                                    <Box sx={{display : "flex",mb:1,alignItems : "center"}} key={index}>
                             
                                        <TextField onChange={(event)=>changeInputDetails(index,event)} multiline maxRows={3} variant="outlined" margin="normal" value={value} fullWidth size="small" sx={{m:0}}/> 
                                        {addDetails.length -1 === index &&
                                          <Avatar sx={{ bgcolor: green[900] , cursor : "pointer",mx : .5,width : 26,height : 26}} variant="circular" onClick={addMoreDetails}>
                                            <AddIcon />
                                          </Avatar>
                                        }
                                        
                                         <Avatar sx={{ bgcolor: red[900] , cursor : "pointer",mx : .5,width : 26,height : 26}} variant="circular" onClick={()=>{
                                             deleteDetails(index)
                                         }}>
                                         <DeleteIcon />
                                       </Avatar>

                                    </Box>
                                        
                                    )
                                })

                            }
                                 
                        </Grid>

                       
                        <Grid item >
                            <Button startIcon={loading && <CircularProgress size={20}/>} disabled={loading} variant='contained' fullWidth type="submit">Add Product</Button>
                        </Grid>

                    </Grid>
                   
                </form>
            </Container>
        </AdminLayout>
    );
}

export async function getServerSideProps(context) {
    await connect()
    const session = await getSession(context) 
    
    const decodedToken = decode(session.token)
  
    if(!(decodedToken.isAdmin || CheckPermission(decodedToken?.roles,PERMISSIONS.WRITE_PRODUCTS))) {
        return {
            notFound: true,
        }
    } 

    if(session.type === "FAIL"){
        return {
            redirect : {
                destination : "/"
            }
        }
    }
    
 
    return {
      props: {session : session.token}, 
    }
}

export default Products;
