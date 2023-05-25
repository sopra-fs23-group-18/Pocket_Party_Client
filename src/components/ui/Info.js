import React, { useState } from 'react';
import InfoIcon from '../../images/information.png';
import '../../styles/ui/Info.scss';

const Info = ({ infotext }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleHover = () => {
        setIsHovered(!isHovered);
    };

    return (
        <div
            className={`info-icon ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
        >
            <div className="circle"></div>
            <div className="info">
                <img src={InfoIcon} alt="Info Icon" />
            </div>
            {isHovered && (
                <div className="tooltip">
                    <label className="tooltip-text">{infotext}</label>
                </div>
            )}
        </div>
    );
};

export default Info;
