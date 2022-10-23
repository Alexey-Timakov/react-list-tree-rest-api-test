import React from 'react';
import LeftMenu from './Components/LeftMenu';
import MainWindow from './Components/MainWindow';
import TopMenu from './Components/TopMenu';

function App() {
  return (
    <>
      <TopMenu />
      <div className='app-menu-window-wrapper'>
        <LeftMenu />
        <MainWindow />
      </div>
    </>
  );
}

export default App;
