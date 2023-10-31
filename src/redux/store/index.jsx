import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import PropTypes from "prop-types";

import authReducer, { authName } from "../slices/auth";
import skillReducer, { skillName } from "../slices/skill";
import portfolioReducer, { portfolioName } from "../slices/portfolio";
import experienceQuery, {
  experienceName,
  experienceReducer,
} from "../queries/experience";
import educationQuery, {
  educationName,
  educationReducer,
} from "../queries/education";
import userQuery, { usersName, usersReducer } from "../queries/users";
import accountQuery, { accountName, accountReducer } from "../queries/account";
import messagesQuery, {
  messagesName,
  messagesReducer,
} from "../queries/messages";

const reducer = {
  [authName]: authReducer,
  [skillName]: skillReducer,
  [portfolioName]: portfolioReducer,
  [experienceName]: experienceReducer,
  [educationName]: educationReducer,
  [usersName]: usersReducer,
  [accountName]: accountReducer,
  [messagesName]: messagesReducer,
};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      experienceQuery.middleware,
      educationQuery.middleware,
      userQuery.middleware,
      accountQuery.middleware,
      messagesQuery.middleware
    ),
});

const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

StoreProvider.propTypes = {
  children: PropTypes.node,
};

export default StoreProvider;
