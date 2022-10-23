import React from 'react';
import iconBack from "../Icons/icon-back.svg";
import iconMenu from "../Icons/icon-menu.svg";
import "../Styles/TopMenu.scss";


export default function TopMenu() {
  return (
    <nav className='top-menu__wrapper'>
      <a className='top-menu__element'><img src={iconMenu} /></a>
      <a className='top-menu__element'><img src={iconBack} /></a>
      <a className='top-menu__element active'>Просмотр</a>
      <a className='top-menu__element'>Управление</a>
    </nav>
  )
}
