import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../Store/store';

import { IStore } from "../Interfaces/IStore";
import { INewRowRequest, INewRowResponse, IRow, ITree, NewRow } from '../Interfaces/IRow';
import { $api } from '../http';

const initialState: IStore = {
  elements: [],
  status: "idle",
  error: null,
};

const tempId = 1.5;

function updateState(arr: IRow[], newItem: IRow, idToUpdate: number): IRow[] {
  return arr.map((item: any) => {
    if (item.id === idToUpdate && item.child.length > 0) return { ...newItem, "child": item.child };
    else if (item.id === idToUpdate && item.child.length === 0) return { ...newItem, "child": [] };
    else if (item.id !== idToUpdate && item.child.length > 0) return { ...item, "child": updateState(item.child, newItem, idToUpdate) }
    else return item;
  })
};

export const rowSlice = createSlice({
  name: "rows",
  initialState,
  reducers: {
    addNewRow: (state, action: PayloadAction<{ parentId: number | null }>) => {
      const newRow = { ...new NewRow(action.payload.parentId) };
      newRow.id = tempId;

      if (action.payload.parentId === null) state.elements.push({ ...newRow });
      else {
        state.elements.map(item => {
          if (item.id === action.payload.parentId) return item.child?.unshift({ ...newRow })
          else if (item.id !== action.payload.parentId) return item.child?.map(i => {
            if (i.id === action.payload.parentId) return i.child?.unshift({ ...newRow })
            else return i
          })
          else return item
        })
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchInitialRows.fulfilled, (state, action) => {
        state.status = "completed";
        state.elements = action.payload;
      })
      .addCase(createRow.fulfilled, (state, action) => {
        state.status = "completed";
        const updatedParents = action.payload.changed;
        const newElement = action.payload.current;

        const updatedState = updateState(state.elements, newElement, tempId);
        state.elements = updatedState;

        // state.elements.map(item1 => {
        //   if (item1.id === tempId) return newElement;
        //   else if (item1.child?.length) return item1.child.map(item2 => {
        //     if (item2.id === tempId) return newElement;
        //     else if (item1.child?.length) return item2.child?.map(item3 => {
        //       if (item3.id === tempId) return newElement;
        //       else return item3;
        //     })
        //     else return item2;
        //   })
        //   else return item1;
        // })


      })
  }
})

export const { addNewRow } = rowSlice.actions;

export const fetchInitialRows = createAsyncThunk("rows/fetchRows", async () => {
  const response = await $api.get<ITree>('list');
  return response.data;
})

export const createRow = createAsyncThunk("rows/createRow", async (newRow: INewRowRequest) => {
  const response = await $api.post<INewRowResponse>("create", newRow);
  return response.data;
})

export const deleteRow = createAsyncThunk("rows/deleteRow", async (rowId: number) => {
  const response = await $api.delete(`${rowId}/delete`);
  return response.data;
})

export default rowSlice.reducer;