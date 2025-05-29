import React from 'react';
import '../styles/main.css';
import { useNavigate } from 'react-router-dom';


// Импорт всех изображений
import logo from '../../public/assets/logo.png';
import bellIcon from '../../public/assets/bell.png';
import shareIcon from '../../public/assets/share.png';
import cardLockedIcon from '../../public/assets/card-locked.png';
import cardIcon from '../../public/assets/card.png';
import homeIcon from '../../public/assets/home.png';
import paymentsIcon from '../../public/assets/payments.png';
import historyIcon from '../../public/assets/history.png';
import sberlisIcon from '../../public/assets/sberlis.png';
import profileIcon from '../../public/assets/profile.png';

import circleIcon from '../../public/assets/circle-icon.png';
import heartIcon from '../../public/assets/heart-icon.png';
import starIcon from '../../public/assets/star-icon.png';
import eripIcon from '../../public/assets/erip-icon.png';

const MainPage = () => {

const navigate = useNavigate();

  const handleSberlisClick = () => {
    navigate('/chat');
  };

return(
  <div className="main-container">
    {/* Header */}
    <div className="header">
      <img src={logo} alt="Logo" className="logo" />
      <div className="header-icons">
        <button><img src={bellIcon} alt="Notifications" /></button>
        <button><img src={shareIcon} alt="Share" /></button>
      </div>
    </div>

    <div className="content">
    {/* Shortcut Cards */}
    <div className="shortcuts">
      <div className="track">
        <button className="shortcut">
          <img src={circleIcon} alt="" />
          <span>Заказать продукт</span>
        </button>
        <button className="shortcut">
          <img src={heartIcon} alt="" />          
          <span>Избранные платежи</span>
        </button>
        <button className="shortcut">
          <img src={starIcon} alt="" />
          <span>Программа лояльности</span>
        </button>
        <button className="shortcut">
          <img src={eripIcon} alt="" />
          <span>ЕРИП</span>
        </button>
      </div>
    </div>

    {/* Products Section */}
    <div className="products">
      <h2>Продукты</h2>
      <div className="cards-section">
        <div className="cards-header">
          <span>Карты</span>
          <button>+</button>
        </div>
        <div className="card blocked">
          <img src={cardLockedIcon} alt="Locked card" />
          <div>
            <strong>1 000 BYN</strong>
            <div className="details">MasterCard ...1234</div>
            <div className="status">Карта заблокирована</div>
          </div>
        </div>
        <div className="card active">
          <img src={cardIcon} alt="Active card" />
          <div>
            <strong>15 000 BYN</strong>
            <div className="details">MasterCard ...5678</div>
          </div>
        </div>
        <div className="view-all">Все карты</div>
      </div>
    </div>
    </div>

    {/* Bottom Navigation */}
    <nav className="main-nav">
      <button className="active">
        <img src={homeIcon} alt="Главная" />
        <span>Главная</span>
      </button>
      <button>
        <img src={paymentsIcon} alt="Платежи" />
        <span>Платежи</span>
      </button>
      <button>
        <img src={historyIcon} alt="История" />
        <span>История</span>
      </button>
      <button  onClick={handleSberlisClick}>
        <img src={sberlisIcon} alt="СберЛис" />
        <span>СберЛис</span>
      </button>
      <button>
        <img src={profileIcon} alt="Профиль" />
        <span>Профиль</span>
      </button>
    </nav>
  </div>
)
};

export default MainPage;
