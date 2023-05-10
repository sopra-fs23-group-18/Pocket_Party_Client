import React from "react";
import { useSpring, animated } from "react-spring";
import "../../styles/views/ErrorScreen.scss";

const ErrorScreen = () => {
    const springProps = useSpring({
        from: { opacity: 0, transform: "translateY(-50px)" },
        to: { opacity: 1, transform: "translateY(0)" },
        config: { duration: 500 },
    });

    return (
        <div className="error-screen">
            <animated.h1 style={springProps}>Oops!</animated.h1>
            <animated.p style={springProps}>
                Something went wrong. Please return to the previous page.
            </animated.p>
        </div>
    );
};

export default ErrorScreen;
