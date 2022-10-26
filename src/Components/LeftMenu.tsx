import React from 'react';
import { menuItems } from './MenItems';
import iconMenuElement from "../Icons/icon-left-menu-element.svg";
import iconArrowDown from "../Icons/icon-arrow-down.svg";

import "../Styles/LeftMenu.scss";

export default function LeftMenu() {
  return (
    <div className='left-menu__wrapper'>
      <div className='left-menu__header'>
        <div>
          <p className='title'>Название проекта</p>
          <p className='subtitle'>Аббревиатура</p>
        </div>
        <img src={iconArrowDown} />
      </div>
      {menuItems.map(item => {
        return (
          <div className={`left-menu__item ${item.id === 104 ? "active" : ""}`} key={item.id} >
            <img src={iconMenuElement} />
            <span>{item.title}</span>
          </div>
        )
      })}
    </div >
  )
}