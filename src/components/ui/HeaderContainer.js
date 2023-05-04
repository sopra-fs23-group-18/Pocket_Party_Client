import "styles/ui/HeaderContainer.scss";
import PropTypes from "prop-types";

function HeaderContainer(props) {
    const { title, text, points } = props;
    return (
        <div className="header-container">
            <div className="header-titlebox">
                {title}
            </div>
            <div className="header-textbox">
                <label>{text}</label>
                <label className="header-pts">{points}</label>
            </div>
        </div>
    );
}

HeaderContainer.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    points: PropTypes.number
};

export default HeaderContainer;
