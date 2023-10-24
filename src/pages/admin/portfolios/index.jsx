import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Upload,
  message,
} from "antd";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPortfolio,
  deletePortfolio,
  getPortfolio,
  getPortfolios,
  portfolioName,
  updatePortfolio,
} from "../../../redux/slices/portfolio";
import PortfolioCard from "../../../components/card/PortfolioCard";
import TextArea from "antd/es/input/TextArea";
import request from "../../../server";
import { getImage } from "../../../utils/getImage";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { LIMIT } from "../../../constants";

const PortfoliosPage = () => {
  const dispatch = useDispatch();

  const { portfolios, loading, total, isModalLoading } = useSelector(
    (state) => state[portfolioName]
  );

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [callback, setCallback] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnId, setBtnId] = useState(null);

  useEffect(() => {
    dispatch(getPortfolios({ search, page }));
  }, [dispatch, search, page, callback, total]);

  const refetch = () => {
    setCallback(!callback);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (selected === null) {
      await dispatch(addPortfolio({ values, photo }));
      message.success("Successfully added");
    } else {
      await dispatch(updatePortfolio({ id: selected, values }));
    }
    setIsModalOpen(false);
    form.resetFields();
    refetch();
    setPhoto(null);
  };

  const uploadPhoto = async (e) => {
    try {
      setPhotoLoading(true);
      let formData = new FormData();
      formData.append("file", e.file.originFileObj);
      const { data } = await request.post("upload", formData);
      setPhoto(data);
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setSelected(id);
    setIsModalOpen(true);
    const { payload } = await dispatch(getPortfolio(id));
    console.log();
    form.setFieldsValue(payload);
  };

  const handleDelete = async (id) => {
    setBtnId(id);
    try {
      setBtnLoading(true);
      await dispatch(deletePortfolio(id));
    } finally {
      setBtnLoading(false);
    }
    refetch();
  };

  return (
    <Fragment>
      <Flex
        justify="space-between"
        gap={36}
        align="center"
        style={{ marginBottom: "30px" }}
      >
        <h1>Portfolios ({total})</h1>
        <Input
          value={search}
          onChange={handleSearch}
          style={{ width: "auto", flexGrow: 1 }}
          placeholder="Searching..."
        />
        <Button onClick={showModal} type="dashed">
          Add Portfolio
        </Button>
      </Flex>
      <Row gutter={16}>
        {loading
          ? "Loading..."
          : portfolios.map((portfolio) => (
              <Col
                style={{ margin: "20px 0" }}
                key={portfolio._id}
                className="gutter-row"
                span={6}
              >
                <PortfolioCard
                  btnLoading={btnLoading}
                  btnId={btnId}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  {...portfolio}
                />
              </Col>
            ))}
      </Row>

      {total > LIMIT ? (
        <Pagination
          total={total}
          pageSize={LIMIT}
          current={page}
          onChange={(page) => setPage(page)}
        />
      ) : null}

      <Modal
        title={selected === null ? "Add portfolio" : "Edit portfolio"}
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add portfolio" : "Save portfolio"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="portfolio"
          autoComplete="off"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Url portfolio"
            name="url"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <TextArea rows={2} />
          </Form.Item>

          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            onChange={uploadPhoto}
          >
            {photo ? (
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                src={getImage(photo)}
                alt="avatar"
              />
            ) : (
              <div>
                {photoLoading ? <LoadingOutlined /> : <PlusOutlined />}
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  {selected === null ? "Add photo" : "Change photo"}
                </div>
              </div>
            )}
          </Upload>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default PortfoliosPage;
