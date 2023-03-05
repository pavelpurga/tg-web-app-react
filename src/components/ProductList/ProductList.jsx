import React, {useCallback, useEffect, useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";

const products =[
    {id:'1', title:'Джинсы', price:60, description:'Синего цвета, прямые'},
    {id:'2', title:'Куртка', price:600, description:'Серого цвета, легкая'},
    {id:'3', title:'Джинсы', price:150, description:'Серого цвета, узкие'},
    {id:'4', title:'Куртка', price:400, description:'Синего цвета, теплая'},
    {id:'5', title:'Свитер', price:100, description:'Серого цвета, теплый'},
    {id:'6', title:'Байка', price:120, description:'Розового цвета, теплая'},
    {id:'7', title:'Снут', price:45, description:'Черного цвета, шерсть'},
    {id:'8', title:'Куртка', price:700, description:'Серого цвета, теплая'},
    {id:'9', title:'Брюки', price:270, description:'Черного цвета, со стрелками'},
    {id:'10', title:'Ботинки', price:399, description:'Черного цвета, покрытые лаком'},
]

const getTotalPrice=(items)=>{
    return items.reduce((acc,item)=>{
        return  acc +=item.price;
    },0)
}
const ProductList = () => {
    const [addedItems,setAddedItems]=useState([]);
    const {tg, queryId}=useTelegram();


    const onSendData =useCallback(()=>{
        const data ={
            product:addedItems,
            totalPrice:getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://localhost:8000',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(data)
        })
    },[])

    useEffect(()=> {
        tg.onEvent('mainButtonClicked',onSendData)
        return()=>{
            tg.offEvent('mainButtonClicked',onSendData)
        }
    },[onSendData])


   const onAdd = (product) => {
       const alreadyAdded = addedItems.find(item=>item.id===product.id);
       let newItems=[];

       if(alreadyAdded){
           newItems=addedItems.filter(item=>item.id !== product.id);
       }else{
           newItems=[...addedItems, product];
       }

       setAddedItems(newItems);

       if(newItems.length===0){
           tg.MainButton.hide();
       }else{
           tg.MainButton.show();
           tg.MainButton.setParams({
                text:`Купить ${getTotalPrice(newItems)}`
           })
       }

   }

    return (
        <div className={'list'}>
            {products.map(item=>(
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />

            ))}
        }
        </div>
    );
};

export default ProductList;