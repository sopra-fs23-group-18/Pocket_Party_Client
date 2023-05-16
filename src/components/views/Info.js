import React, { useState } from 'react';
import '../../styles/views/Info.scss'
const Info = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [infotext, setInfotext] = useState("Testsssssssssssssssss");
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
                <span>?</span>
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
