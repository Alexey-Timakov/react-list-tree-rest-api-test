import React, { useEffect } from 'react';
import RowComponent from './RowComponent';
import { fetchInitialRows } from '../Reducers/rowReducer';
import { useAppDispatch, useAppSelector } from '../hooks';

import "../Styles/MainWindow.scss";

export default function MainWindow() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(state => state.status);
  const rows = useAppSelector(state => state.elements);

  useEffect(() => {
    if (status === "idle") dispatch(fetchInitialRows());
  }, [])

  return (
    <div className='main-window__wrapper'>
      <div className='main-window__titles'>
        <a>Строительно-монтажные работы</a>
      </div>
      <div className='main-window__body'>
        <div className='row__title-wrapper'>
          <div className='row__title'>Уровень</div>
          <div className='row__title'>Наименование работ</div>
          <div className='row__title'>Основная з/п</div>
          <div className='row__title'>Оборудование</div>
          <div className='row__title'>Накладные расходы</div>
          <div className='row__title'>Сметная прибыль</div>
        </div>
        {rows.map(item => {
          return <RowComponent row={item} parentId={null} key={item.id} level={1} />
        })}
      </div>
    </div>
  )
}
