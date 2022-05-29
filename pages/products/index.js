import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";  
import Loader from "../../components/Loader";
import EndMsg from "../../components/EndMsg";
import axios from "axios";
import { Container, Grid } from "@mui/material"; 
import Itemcard from "../../components/ItemCard";
import Layout from "../../components/Layout";
function Products() {


  const [items, setItems] = useState([]); 
  const [hasMore, sethasMore] = useState(true); 
  const [page, setpage] = useState(0);


  
  const fetchProducts = async () => {
    try{
    const {data} = await axios.get(`/api/products?page=${page}` );
    
      return data.result;  
    }catch(err){
      console.log(err.response.data)
      return []
    }
  };
  
  const fetchData = async () => {
    try{
      const ProductsFormServer = await fetchProducts();
    
      setItems([...items, ...ProductsFormServer]);

      if (ProductsFormServer.length === 0) {
        return sethasMore(false);
      }
      setpage(page + 1);
    }catch(err){
        console.log(err)
    }
    
  };
 
  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  
  return (
    
    <Layout>
      <Container>
          
        <Grid container sx={{mt : 2,justifyContent:"center"}}> 
            <Grid item md={10} >
            
            <Grid container >
                <InfiniteScroll
                    dataLength={items.length} //This is important field to render the next data
                    next={fetchData} 
                    hasMore={hasMore}
                    loader={<Loader />}
                    endMessage={<EndMsg />} 
                    width="100%"
                    style={{"overflow" : "hidden"}}
                    scrollThreshold="1px" // when arrive last 1px from the last component render next props
                 >
                    {items.map((item) => {
                        
                        return (
                            <Grid item key={item?._id} sx={{mt : 2}}>
                               
                                    <Itemcard   
                                        name={item.name} 
                                        mainCategory={item.category.main}
                                        price={item.price} 
                                        rating={parseInt(item.rating)} 
                                        description={item.description} 
                                        image={item.image}
                                        updatedAt={item.updatedAt} 
                                        slugName={item.slugName}
                                        itemDetails={item.ItemDetails}
                                    />

                                     
                            </Grid>
                        )
                    })}

                </InfiniteScroll>
            </Grid>
            
          </Grid>
        </Grid>
        </Container>
    </Layout>
  );
}

export default Products;
