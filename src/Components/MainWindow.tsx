import React from 'react';
import ListOfString from './ListOfString';
import "../Styles/MainWindow.scss";

export default function MainWindow() {
  return (
    <div className='main-window__wrapper'>
      <div className='main-window__titles'>
        <a>Строительно-монтажные работы</a>
      </div>
      <div className='main-window__body'>
        <ListOfString />
      </div>
    </div>
  )
}
