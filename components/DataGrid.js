import React,{memo, useState} from 'react';

import {Table,FormControl,TableContainer, TableHead,Button,Paper,TableRow, TableCell, TableBody, TablePagination, TextField, Select, MenuItem} from "@mui/material"

const DateConverters = {
    "year" : (date)=>new Date(date).getFullYear(),
    "dayOfWeek" : (date)=>new Date(date).getDay(),
    "month" : (date) => new Date(date).getMonth()
} 
  
const Datagrid = ({ ActionLeft , ActionRight,rows , columns , rowsPerPageOptions , onPageNext , onSearch }) => {
     
    const operators = {
        text : ["contains","equals","startWith","endWith"],
        number : ["=" , ">" , "<" , ">=" , "<="],  
        date : ["year","dayOfWeek","month","equals"]
    }

    const [dataSet,setDataSet] = React.useState({
        rows,
        page : 0,
        rowsPerPage : rowsPerPageOptions ? rowsPerPageOptions[0] : 5 , 
    })

    const [searchControllers , setSearchControllers] = useState(()=>{
        const columnName = Object.keys(columns).find((key)=>columns[key].searchable) 
        const isSelectedTye = getColumnType(columnName) === "select"
        return {
            field : columnName,
            operator : isSelectedTye ? '' : operators[getColumnType(columnName)][0],
            loadSelectValue : false
       }
    })

    

    const [hasNext,setHasNext] = useState(true)
    const searchTextRef = React.useRef()  
    const [FetchedPageNumber,setFetchedPageNumber] = useState(0)

     
    const RenderRows = React.useMemo((()=>{
         
        return (
            dataSet.rows.slice(dataSet.page * dataSet.rowsPerPage , (dataSet.page + 1) * dataSet.rowsPerPage).map((row,index)=>{ 
 
                return (
                    <TableRow key={index} hover>
                        {Object.keys(columns).map((column,index)=>{ 
                            const col = getColumn(column)
                            return (
                                <TableCell key={index}>{col?.virtualColumn ? col?.virtualColumn(row) : row[column]?.toString()}</TableCell>
                            )
                        })
                        } 

                        <TableCell>
                                
                            { ActionLeft &&
                                React.cloneElement(ActionLeft,{onClick:function(){
                                    if(ActionLeft.props.onClick) ActionLeft.props.onClick.call(this,row)
                                }})
                            }

                            { ActionRight &&
                                React.cloneElement(ActionRight,{onClick:function(){
                                    if(ActionRight.props.onClick) ActionRight.props.onClick.call(this,row)
                                }})
                            }
                        </TableCell>
                    
                    </TableRow>
                )

           })

        )
    }),[dataSet.rows])
 
    
  
    const handleSearch = async()=>{ 
     
       if(onSearch) {

        const opr = searchControllers.operator
        const value = DateConverters[opr]
    
        const data = await onSearch({
                field : searchControllers.field,
                value : value ? value(searchTextRef.current.value) : searchTextRef.current.value,
                operator : opr
        },dataSet.rowsPerPage) 

        setDataSet({
            rows : data,
            page : 0,
            rowsPerPage : dataSet.rowsPerPage 
        })
        
        }

    }
    


    function getColumn(field){ 
        if(typeof field !== "string") throw new Error("field must be string")
        return columns[field];
    }
    function getColumnType(field){ 
        if(typeof field !== "string") throw new Error("field must be string")
        return getColumn(field)?.type || "text";
    }

    function getOprToSpecColumn(field){
        if(typeof field !== "string") throw new Error("field must be string")
        const fieldType = getColumnType(field);
        if(typeof operators[fieldType] !== "undefined")
            return operators[fieldType]
        else
        throw new Error(field + " type must be " + operators).join(" , ")
    }
       
    
    const handleChangeFiled = ({target : {value}})=>{  

        const columnType = getColumnType(value)
        const isSelectType = columnType === "select"
        setSearchControllers({
            field : value,
            operator : isSelectType ? "" : operators[columnType][0], 
            loadSelectValue : isSelectType 
        })
    }

    const handleChangeOperator = ({target : {value}})=>{ 
        setSearchControllers({
            field : searchControllers.field,
            operator : value
        })
    }

    const onPageChange = (async (event , pageNb)=>{ 

        if(onPageNext){ 
            var data = []
            if(pageNb > FetchedPageNumber ){  
                setFetchedPageNumber(pageNb)
                data = await onPageNext.call(event,pageNb,dataSet.rowsPerPage)
                if(data.length <= 0){
                    return setHasNext(false)
                }
                setHasNext(true) 
            }else setHasNext(pageNb <= FetchedPageNumber - 1)
            
            
            setDataSet({
                rows : [...dataSet.rows,...data],
                page : pageNb,
                rowsPerPage : dataSet.rowsPerPage
            })
            
        }
    })

    const onRowPerPageChange = async({target : {value}})=>{
        var data = []
        const pageSizeToFetch = value - dataSet.rowsPerPage;
        if(pageSizeToFetch > 0 && dataSet.page >= FetchedPageNumber){   

            data = await onPageNext.call(event,dataSet.page + 1,pageSizeToFetch)
            if(data.length <= 0){
                return setHasNext(false)
            }

        }

        setHasNext(true)
        setDataSet({
            rows : [...dataSet.rows,...data],
            page : dataSet.page,
            rowsPerPage : value
        })
    }


    function refreshAll(){
        
    }
    return (
        <>
            
            <Paper>
                <Table size="small" sx={{my : 1}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Column</TableCell>
                            {getColumnType(searchControllers.field) !=="select" &&
                               <TableCell>Operator</TableCell>
                            } 
                            
                            <TableCell>Value</TableCell>
                                
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody> 
                         <TableRow>
                            <TableCell>
                                <FormControl variant="standard" fullWidth > 
                                    <Select   
                                        value={searchControllers.field ?? ''}
                                        onChange={handleChangeFiled} 
                                    >
                                            
                                        {
                                        Object.keys(columns).filter((col)=>getColumn(col).searchable).map((column,index)=>{
                                        
                                                return (
                                                    <MenuItem key={index} value={column}>{getColumn(column)?.header ? getColumn(column)?.header : column}</MenuItem>
                                                )
                                        })

                                        }
                                        
                                    </Select>
                                </FormControl>
                            </TableCell>      
                            {Boolean(searchControllers.field) && getColumnType(searchControllers.field) != "select" &&
                                <TableCell>
                                    <FormControl variant="standard" fullWidth> 
                                        <Select   
                                            value={searchControllers.operator ?? ''} 
                                            onChange={handleChangeOperator} 
                                            
                                        >
                                            {   
                                                getOprToSpecColumn(searchControllers.field).map((ope,index)=>{
                                                     
                                                    return (
                                                        <MenuItem key={index} value={ope + ''}>{ope}</MenuItem>
                                                    )
                                                })  
                                                
                                            }
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            }
                            <TableCell>
                            {getColumnType(searchControllers.field) !=="select" ?
                                
                                <TextField inputRef={searchTextRef} type={getColumnType(searchControllers.field)} size="small" fullWidth/>     
                            
                                :
                                <Select
                                    value={searchControllers.loadSelectValue}  
                                    fullWidth
                                    variant="standard" 
                                    inputRef={searchTextRef}
                                >{
                                    getColumn(searchControllers.field).options.map(({name , value},index)=>{
                                        return (
                                            <MenuItem key={index} value={value+''}>{name}</MenuItem>
                                        )
                                    })
                                 }
                                </Select>
                               
                            }
                            </TableCell>

                            <TableCell>
                                <Button variant="contained" onClick={handleSearch} sx={{mx:1}}>Search</Button>
                                <Button variant="contained" onClick={refreshAll} sx={{mx:1}}>Refresh All</Button>
                            </TableCell>

                        </TableRow>
                    </TableBody>
                </Table>

            </Paper>

            <TableContainer>
                
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {Object.keys(columns).map((column,index)=>{
                                const col = getColumn(column)
                                return (
                                    <TableCell key={index}>{col?.header ? col?.header : column  }</TableCell>
                                )
                            })}

                            {(ActionLeft || ActionRight) &&
                                <TableCell>
                                    Actions
                                </TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {RenderRows}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={-1}
                    page={dataSet.page}
                    rowsPerPage={dataSet.rowsPerPage}
                    nextIconButtonProps={{"disabled" : !hasNext }}
                    onPageChange={onPageChange}
                    rowsPerPageOptions={rowsPerPageOptions}
                    onRowsPerPageChange={onRowPerPageChange} 
                    
                />
            </TableContainer>
        </>
    );
}

export default memo(Datagrid);

 