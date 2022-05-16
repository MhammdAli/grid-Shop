import { Button, Checkbox, Container, FormControl, Grid, ListItemIcon, ListItemText, MenuItem, Select, TextField, Typography , Box , Avatar} from '@mui/material';
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
const Products = () => {

  
    

   
    const [selected, setSelected] = useState([]);

    const isAllSelected =
    selected.length > 0 && selected.length === selected.length;
    const handleChange = (event) => {
       const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setSelected(selected.length === selected.length ? [] : selected);
            return;
        }
        setSelected(value);
    };

    const [categories , setCategories] = React.useState([]);
    const [brands , setBrands] = React.useState([]);
    const [branches , setBranches] = React.useState([]);


   
    const [addDetails , setAddDetails] = React.useState([{
        input : <TextField type="text" multiline maxRows={3} variant="outlined" margin="normal" fullWidth size="small" name="field.0" sx={{m:0}}
        
        /> }])

    const [selectedMainCategory , setSelectedMainCategory] = React.useState("");
    const [selectedSubCategory , setSelectedSubCategory] = React.useState("");
    const [selectedBrand , setBrand] = React.useState("");
    

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
 
        // const {
        //     productImage,
        //     productName : {value : productName},
        //     slugName : {value : slugName},
        //     description : {value : description},
        //     price : {value : price},
        //     discount : {value : dicount}
        // } = event.target
 
        //console.log(selected,selectedMainCategory , selectedSubCategory , selectedBrand)
        // productImage.files[0]
 

    }

   

    function addMoreDetails(){

        if(addDetails.length < 6)
            setAddDetails([
                ...addDetails, 
                {input : <TextField type="text" multiline maxRows={3}
                            variant="outlined" margin="normal" fullWidth size="small" 
                            name={`field.${addDetails.length}`} 
                            sx={{m:0}}  
                />} 
                
            ])
        else
        alert("you cant add more than 6 fields")
    }

    function deleteDetails(index){ 
        if(addDetails.length > 1) 
          setAddDetails(addDetails.filter((e,currentIndex)=>currentIndex !== index))
        else
          alert("You must keep at least 1 field")
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


    return (
        <AdminLayout Title="Add Product">
            <Container>
                <SectionSplitter title="Add Products" sx={{mb : 3}}/>
                <form onSubmit={AddProduct}>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>Product Name</Typography>
                           <TextField name="productName" variant="outlined" size='small' placeholder='product Name' fullWidth/>
                        </Grid>
                        <Grid item md={6}  xs={12}>
                           <Typography sx={{mb : 1}}>Slug Name</Typography>
                           <TextField name="slugName" variant="outlined" size='small' placeholder='Slug Name' fullWidth/> 
                        </Grid>
                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>Description</Typography>
                           <TextField name="description" variant="outlined" size="small" multiline rows={4} placeholder='Description' fullWidth/>
                        </Grid> 
                        <Grid item md={6} xs={12}> </Grid>

                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>price</Typography>
                           <TextField name="price" variant="outlined" type="number" size="small"  placeholder='price' fullWidth/>
                        </Grid> 
                        <Grid item md={6} xs={12}>
                           <Typography sx={{mb : 1}}>discount</Typography>
                           <TextField name="discount" variant="outlined" type="number" size="small"  placeholder='discount' fullWidth/>
                        </Grid> 

                        <Grid item md={6} xs={12}>
                            <Typography sx={{mb : 1}}>Main Category</Typography>
                            <Select size="small" fullWidth onChange={handleMainCategory} value={selectedMainCategory }>
                                {categories.map((category,index)=>{
                                        return (
                                            <MenuItem value={category.mainCategory} key={index}>{category.mainCategory}</MenuItem>  
                                        )
                                    })

                                }                    
                            </Select>
                        </Grid> 

                        <Grid item md={6} xs={12}>
                            <Typography sx={{mb : 1}}>sub Category</Typography> 
                            <Select size="small" fullWidth onChange={handleSubCategory} value={selectedSubCategory || ""}>
                                 {categories.map((category,index)=>{
                                        return (
                                            <MenuItem value={category.subCategory} key={index}>{category.subCategory}</MenuItem>  
                                        )
                                   })

                                }                    
                            </Select>
                        </Grid> 

                        <Grid item md={6} xs={12}>
                            <Typography sx={{mb : 1}} >Brand</Typography>
                            <Select size="small" fullWidth onChange={handleBrand} value={selectedBrand || ""}>
                           
                            {brands.map(({brand},index)=>{
                                        return (
                                            <MenuItem value={brand} key={index}>{brand}</MenuItem>  
                                        )
                                   })

                                }   
                                                   
                            </Select>
                                     
                        </Grid> 

                        <Grid item md={6} xs={12}> </Grid>

                        <Grid item md={6} xs={12}>
                        <FormControl fullWidth size="small">
                            <Typography sx={{mb : 1}}>Stocks</Typography> 
                            <Select 
                                multiple 
                                value={selected}
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
                                            selected.length > 0 && selected.length < selected.length
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
                                    <Checkbox checked={selected.indexOf(branchName) > -1} />
                                    </ListItemIcon>
                                    <ListItemText primary={branchName} />
                                </MenuItem>
                                ))}

                            </Select>
                            </FormControl>
                        </Grid>
 

                        <Grid item md={6} xs={12}>
                            <Typography sx={{mb:1}}>Product Image</Typography> 
                            <TextField 
                                type="file"
                                variant="outlined" margin="normal" fullWidth size="small" 
                                name="productImage" 
                                sx={{m:0}}
                            /> 
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{mb:1}}>Product Details</Typography>
                            
                                {addDetails.map(({input},index)=>{
                                    return (
                                       
                                        <Box sx={{display : "flex",mb:1,alignItems : "center"}} key={index}>
                            
                                         {input}
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
                            <Button variant='contained' fullWidth type="submit">Add Product</Button>
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
    
    if(decodedToken.isAdmin == false) {
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
