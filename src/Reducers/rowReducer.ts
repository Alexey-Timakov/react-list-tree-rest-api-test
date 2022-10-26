import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, store } from '../Store/store';

import { IStore } from "../Interfaces/IStore";
import { INewRowRequest, INewRowResponse, IRow, ITree, IUpdateRowData, IUpdateRowRequest, IUpdateRowResponse, NewRow } from '../Interfaces/IRow';
import { $api } from '../http';

const initialState: IStore = {
  elements: [],
  status: "idle",
  error: null,
};

//id для вновь сгенерированной строки, чтобы потом можно было ее найти в сторе.
export const tempId = 1.5;

function addNewRowToState(arr: IRow[], newElement: IRow, parentId: number): IRow[] {
  return arr.map((item: any) => {
    if (item.id === parentId) {
      item.child.unshift(newElement);
      return item;
    }
    else if (item.id !== parentId && item.child.length === 0) return item;
    else if (item.id !== parentId && item.child.length > 0) return { ...item, "child": addNewRowToState(item.child, newElement, parentId) };
    else return item;
  })
}

function updateRowInState(arr: IRow[], newItem: IRow, idToUpdate: number): IRow[] {
  return arr.map((item: any) => {
    if (item.id === idToUpdate && item.child.length > 0) return { ...newItem, "child": item.child };
    else if (item.id === idToUpdate && item.child.length === 0) return { ...newItem, "child": [] };
    else if (item.id !== idToUpdate && item.child.length > 0) return { ...item, "child": updateRowInState(item.child, newItem, idToUpdate) }
    else return item;
  })
};

function deleteRowFromState(arr: IRow[], idToURemove: number): IRow[] {
  return arr.filter((item: any) => {
    if (item.id === idToURemove) return false;
    if (item.id !== idToURemove && item.child.length === 0) return true
    else if (item.id !== idToURemove && item.child.length > 0) return item.child = deleteRowFromState(item.child, idToURemove);
  })
};

export const rowSlice = createSlice({
  name: "rows",
  initialState,
  reducers: {
    addNewRow: (state, action: PayloadAction<{ parentId: number | null }>) => {
      const newRow = { ...new NewRow(action.payload.parentId) };
      newRow.id = tempId;

      if (action.payload.parentId === null) state.elements.push(newRow);
      else state.elements = addNewRowToState(state.elements, newRow, action.payload.parentId)
    },

    deleteRow: (state, action: PayloadAction<{ rowId: number }>) => {
      state.elements = deleteRowFromState(state.elements, action.payload.rowId)
    }
  },

  extraReducers(builder) {
    builder
      .addCase(fetchInitialRows.fulfilled, (state, action) => {
        state.status = "completed";
        state.elements = action.payload;
      })
      .addCase(fetchCreateRow.fulfilled, (state, action) => {
        state.status = "completed";
        const updatedParents = action.payload.changed;
        const newElement = action.payload.current;

        state.elements = updateRowInState(state.elements, newElement, tempId);

        for (let elem of updatedParents) {
          state.elements = updateRowInState(state.elements, elem, elem.id);
        }
      })
      .addCase(fetchDeleteRow.fulfilled, (state, action) => {
        state.status = "completed";
        const updatedParents = action.payload.changed;

        for (let elem of updatedParents) {
          state.elements = updateRowInState(state.elements, elem, elem.id);
        }
      })
      .addCase(fetchUpdateRow.fulfilled, (state, action) => {
        state.status = "completed";
        const updatedElement = action.payload.current;
        const updatedParents = action.payload.changed;

        state.elements = updateRowInState(state.elements, updatedElement, updatedElement.id);

        for (let elem of updatedParents) {
          state.elements = updateRowInState(state.elements, elem, elem.id);
        }
      })
  }
})

export const { addNewRow, deleteRow } = rowSlice.actions;

export const fetchInitialRows = createAsyncThunk("rows/fetchRows", async () => {
  const response = await $api.get<ITree>('list');
  return response.data;
})

export const fetchCreateRow = createAsyncThunk("rows/createRow", async (newRow: INewRowRequest) => {
  const response = await $api.post<INewRowResponse>("create", newRow);
  return response.data;
})

export const fetchDeleteRow = createAsyncThunk("rows/deleteRow", async (rowId: number) => {
  const response = await $api.delete<IUpdateRowResponse>(`${rowId}/delete`);
  return response.data;
})

export const fetchUpdateRow = createAsyncThunk("rows/updateRow", async (updateData: IUpdateRowData) => {
  const { rowId, data } = updateData;
  const response = await $api.post<IUpdateRowResponse>(`${rowId}/update`, data);
  return response.data;
})

export default rowSlice.reducer;