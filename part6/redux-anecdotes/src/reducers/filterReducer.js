import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    initialState: '',
    name: 'filter',
    reducers: {
        setFilter: (state,action) => action.payload
    } 
})

export const {setFilter} = filterSlice.actions
export default filterSlice.reducer  
