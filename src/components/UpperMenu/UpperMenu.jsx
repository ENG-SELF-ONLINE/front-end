// eslint-disable-next-line no-unused-vars
import React from "react";
import {Progress} from "antd";
import './styles.css';
import heart from './images/heart.png';
import avatar from './images/avatar.png';
import exit from './images/exit.png';


const icons = {
    heart: heart,
    avatar: avatar,
    exit: exit,
};

const UpperMenu = () => {
    return (
        <div className="upper-menu-container">
            <div className="header">
                <div className="level-container">
                    <span className="level">A1</span>
                    <div className="progress-bar">
                        <Progress percent={50} showInfo={false}/>
                    </div>
                    <span className="level">A2</span>
                </div>
                {Object.entries(icons).slice(0, 3).map(([key, src]) => (
                    <div key={key} className={`header-icon ${key}-icon`} type="button"
                         onClick={() => {
                             if (key === 'heart') {
                                 window.location.href = '/favourites';
                             } else if (key === 'avatar') {
                                 window.location.href = '/profile';
                             } else if (key === 'exit') {
                                 window.location.href = '/exit';
                             }
                         }}>
                        <img src={src}
                             alt={key === 'heart' ? 'Избранные книги' : key === 'avatar' ? 'Аватар' : 'Выход'}/>
                    </div>
                ))}
            </div>
            <div className="header-clone"></div>
        </div>
    )
}

export default UpperMenu;