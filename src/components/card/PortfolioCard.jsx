import { Avatar, Button, Card, Flex } from "antd";
import Meta from "antd/es/card/Meta";
import PropTypes from "prop-types";
import { DeleteFilled, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { getImage } from "../../utils/getImage";

const PortfolioCard = ({
  _id,
  name,
  url,
  photo,
  description,
  handleDelete,
  btnId,
  btnLoading,
  handleEdit,
}) => {
  return (
    <Card
      style={{
        width: 300,
      }}
      cover={
        <img width={300} height={270} alt="example" src={getImage(photo)} />
      }
    >
      <div style={{ marginBottom: "20px", fontSize: "12px" }}>
        <Link target="_blank" to={url}>
          {url}
        </Link>
      </div>
      <Meta
        avatar={
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
        }
        title={name}
        description={description}
      />
      <hr style={{ margin: "15px 0" }} />
      <Flex justify="space-between" align="center">
        <Button onClick={() => handleEdit(_id)} type="primary">
          <EditOutlined /> Edit
        </Button>
        {btnId === _id && btnLoading ? (
          <Button
            loading={true}
            type="primary"
            danger
            onClick={() => handleDelete(_id)}
          >
            <DeleteFilled />
            Loading...
          </Button>
        ) : (
          <Button type="primary" danger onClick={() => handleDelete(_id)}>
            <DeleteFilled />
            Delete
          </Button>
        )}
      </Flex>
    </Card>
  );
};

PortfolioCard.propTypes = {
  _id: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  photo: PropTypes.object,
  description: PropTypes.string,
  btnLoading: PropTypes.bool,
  btnId: PropTypes.string,
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
};

export default PortfolioCard;
