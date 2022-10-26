import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks';
import { Row } from '../Interfaces/Row';
import iconNewElement1 from "../Icons/Icon-new-element-1.svg";
import iconNewElement2 from "../Icons/Icon-new-element-2.svg";
import iconNewElement3 from "../Icons/Icon-new-element-3.svg";
import iconRemoveElement from "../Icons/icon-trash.svg";

import { addNewRow, deleteRow, fetchCreateRow, fetchDeleteRow, fetchUpdateRow, tempId } from '../Reducers/rowReducer';

import "../Styles/Row.scss";
import { INewRowRequest, IUpdateRowData, IUpdateRowRequest } from '../Interfaces/IRow';

export default function RowElement({ row, parentId, level }: Row) {
  const dispatch = useAppDispatch();

  const [colName, changeColName] = useState<string>(row.rowName);
  const [salary, changeSalary] = useState<number>(row.salary);
  const [equipment, changeEquipment] = useState<number>(row.equipmentCosts);
  const [overheads, changeOverheads] = useState<number>(row.overheads);
  const [profit, changeProfit] = useState<number>(row.estimatedProfit);

  const [isControlWindowActive, toggleControlWindow] = useState<boolean>(false);
  const [isInputsDisabled, disableInputs] = useState<boolean>(true);

  const addNewRowElement = (parentId: number | null) => {
    dispatch(addNewRow({ parentId }))
  };

  const deleteRowFromServer = (rowId: number) => {
    dispatch(deleteRow({ rowId }));
    dispatch(fetchDeleteRow(rowId));
  };

  const sendNewRowtoServer = () => {
    const newRowObject: INewRowRequest = {
      parentId: parentId,
      rowName: colName,
      equipmentCosts: equipment,
      estimatedProfit: profit,
      machineOperatorSalary: 0,
      mainCosts: 0,
      materials: 0,
      mimExploitation: 0,
      overheads: overheads,
      salary: salary,
      supportCosts: 0
    };
    console.log("send new row");
    dispatch(fetchCreateRow(newRowObject))
  };

  const sendUpdatedRowToServer = () => {
    const updatedRow: IUpdateRowRequest = {
      equipmentCosts: equipment,
      estimatedProfit: profit,
      machineOperatorSalary: 0,
      mainCosts: 0,
      materials: 0,
      mimExploitation: 0,
      overheads: overheads,
      rowName: colName,
      salary: salary,
      supportCosts: 0
    };
    const updatedRowData: IUpdateRowData = {
      rowId: row.id,
      data: updatedRow
    };
    console.log(updatedRowData);
    dispatch(fetchUpdateRow(updatedRowData));
  };

  const sendRowToServer = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      disableInputs(true);

      if (row.id === tempId) sendNewRowtoServer();
      else sendUpdatedRowToServer();
    }
  };

  const handleMouseOver = () => {
    toggleControlWindow(true);
  };

  const handleMouseOut = () => {
    toggleControlWindow(false);
  };

  useEffect(() => {
    changeColName(row.rowName);
    changeSalary(row.salary);
    changeEquipment(row.equipmentCosts);
    changeOverheads(row.overheads);
    changeProfit(row.estimatedProfit);
  }, [row]);

  useEffect(() => {
    if (colName === "") disableInputs(false);
  }, []);

  return (
    <>
      <div className='row__wrapper' onDoubleClick={() => disableInputs(false)}>
        <div className='row__column row__column_level' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          {level === 1 && <i className='level-one'><img src={iconNewElement1} /></i>}
          {level === 2 && <i className='level-two'><img src={iconNewElement2} /></i>}
          {level >= 3 && <i className='level-three'><img src={iconNewElement3} /></i>}
          {isControlWindowActive && isInputsDisabled &&
            <div className='row__control-panel'>
              {level === 1 && <img src={iconNewElement1} onClick={() => addNewRowElement(null)} />}
              {level === 1 && <img src={iconNewElement2} onClick={() => addNewRowElement(row.id)} />}
              {level === 2 && <img src={iconNewElement2} onClick={() => addNewRowElement(parentId)} />}
              <img src={iconNewElement3} onClick={() => addNewRowElement(row.id)} />
              <img src={iconRemoveElement} onClick={() => deleteRowFromServer(row.id)} />
            </div>}
        </div>
        <div className='row__column row__column_name'>
          <input type="text" disabled={isInputsDisabled} value={colName} onKeyDown={sendRowToServer} onChange={(e: React.FormEvent<HTMLInputElement>) => changeColName(e.currentTarget.value)} />
        </div>
        <div className='row__column row__column_salary'>
          <input type="number" min={0} disabled={isInputsDisabled} value={salary} onKeyDown={sendRowToServer} onChange={(e: React.FormEvent<HTMLInputElement>) => changeSalary(+e.currentTarget.value)} />
        </div>
        <div className='row__column row__column_equipment'>
          <input type="number" min={0} disabled={isInputsDisabled} value={equipment} onKeyDown={sendRowToServer} onChange={(e: React.FormEvent<HTMLInputElement>) => changeEquipment(+e.currentTarget.value)} />
        </div>
        <div className='row__column row__column_overheads'>
          <input type="number" min={0} disabled={isInputsDisabled} value={overheads} onKeyDown={sendRowToServer} onChange={(e: React.FormEvent<HTMLInputElement>) => changeOverheads(+e.currentTarget.value)} />
        </div>
        <div className='row__column row__column_profit'>
          <input type="number" min={0} disabled={isInputsDisabled} value={profit} onKeyDown={sendRowToServer} onChange={(e: React.FormEvent<HTMLInputElement>) => changeProfit(+e.currentTarget.value)} />
        </div>
      </div>
      {(row.child?.length !== 0) &&
        row.child?.map(item => {
          return <RowElement row={item} parentId={row.id} level={level + 1} key={item.id} />
        })
      }
    </>
  )
}
