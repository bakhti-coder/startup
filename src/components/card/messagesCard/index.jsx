import "./style.scss";
import PropTypes from "prop-types";

const MessagesCard = ({ message, title, user }) => {
  return (
    <div className="message-card">
      <h3 className="message-title">{title}</h3>
      <p className="message-content">{message}</p>
      <p className="message-user">{user}</p>
    </div>
  );
};

MessagesCard.propTypes = {
  message: PropTypes.string,
  title: PropTypes.string,
  user: PropTypes.string,
};

export default MessagesCard;
