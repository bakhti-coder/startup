import { Tabs } from "antd";
import "./style.scss";
import { Fragment } from "react";

const onChange = (key) => {
  console.log(key);
};

const items = [
  {
    key: "1",
    label: "Tab 1",
    children: <Fragment>efsdf</Fragment>,
  },
  {
    key: "2",
    label: "Tab 2",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Tab 3",
    children: "Content of Tab Pane 3",
  },
];

const AdminAccountPage = () => {
  return (
    <Tabs

      tabPosition={"left"}
      defaultActiveKey="1"
      items={items}
      onChange={onChange}
    />
  );
};

export default AdminAccountPage;
