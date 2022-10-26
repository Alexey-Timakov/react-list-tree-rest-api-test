import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks';
import { Row } from '../Interfaces/Row';
import iconNewElement1 from "../Icons/Icon-new-element-1.svg";
import iconNewElement2 from "../Icons/Icon-new-element-2.svg";
import iconChangeElement from "../Icons/Icon-change-element.svg";
import iconRemoveElement from "../Icons/icon-trash.svg";

import { addNewRow, createRow } from '../Reducers/rowReducer';

import "../Styles/Row.scss";
import { INewRowRequest } from '../Interfaces/IRow';

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

  const sendRowToServer = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      disableInputs(true);

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

      dispatch(createRow(newRowObject))
    }
  };

  const handleMouseOver = () => {
    toggleControlWindow(true);
  };

  const handleMouseOut = () => {
    toggleControlWindow(false);
  };

  useEffect(() => {
    if (colName === "") disableInputs(false);
  }, []);

  return (
    <>
      <div className='row__wrapper'>
        <div className='row__column row__column_level' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          {level === 1 && <i className='level-one'><img src={iconNewElement1} /></i>}
          {level === 2 && <i className='level-two'><img src={iconNewElement2} /></i>}
          {level === 3 && <i className='level-three'><img src={iconChangeElement} /></i>}
          {isControlWindowActive && isInputsDisabled &&
            <div className='row__control-panel'>
              {level === 1 && <img src={iconNewElement1} onClick={() => addNewRowElement(null)} />}
              {level === 1 && <img src={iconNewElement2} onClick={() => addNewRowElement(row.id)} />}
              {level === 2 && <img src={iconNewElement2} onClick={() => addNewRowElement(row.id)} />}
              <img src={iconChangeElement} />
              <img src={iconRemoveElement} />
            </div>}
        </div>
        <div className='row__column row__column_name'><input type="text" disabled={isInputsDisabled} value={colName} onKeyDown={sendRowToServer} onChange={(e: React.FormEvent<HTMLInputElement>) => changeColName(e.currentTarget.value)} /></div>
        <div className='row__column row__column_salary'><input type="text" disabled={isInputsDisabled} value={salary} /></div>
        <div className='row__column row__column_equipment'><input type="text" disabled={isInputsDisabled} value={equipment} /></div>
        <div className='row__column row__column_overheads'><input type="text" disabled={isInputsDisabled} value={overheads} /></div>
        <div className='row__column row__column_profit'><input type="text" disabled={isInputsDisabled} value={profit} /></div>
      </div>
      {(row.child?.length !== 0) &&
        row.child?.map(item => {
          return <RowElement row={item} parentId={row.id} level={level + 1} key={item.id} />
        })
      }
    </>
  )
}
