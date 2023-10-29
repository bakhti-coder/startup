import { Fragment, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Space,
  Table,
  Avatar,
  Upload,
} from "antd";

import { LIMIT } from "../../../constants";
import {
  useCreateUsersMutation,
  useDeleteUsersMutation,
  useGetOneUsersMutation,
  useGetUsersQuery,
  useUpdateUsersMutation,
  useUploadPhotoMutation,
} from "../../../redux/queries/users";
import { userImage } from "../../../utils/getImage";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const UsersPage = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loadingButtonId, setLoadingButtonId] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  const {
    data: { users, total } = { users: [], total: 0 },
    isFetching,
    refetch,
  } = useGetUsersQuery({ page, search });

  const [createUsers] = useCreateUsersMutation();
  const [getOneUsers] = useGetOneUsersMutation();
  const [uploadPhoto] = useUploadPhotoMutation();
  const [updateUsers] = useUpdateUsersMutation();
  const [deleteUsers] = useDeleteUsersMutation();

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
    setSelected(null);
    setPhoto(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      setIsModalLoading(true);
      const values = await form.validateFields();
      values.photo = photo;
      if (selected === null) {
        await createUsers(values).unwrap();
      } else {
        await updateUsers({ id: selected, body: values }).unwrap();
      }
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    setLoadingButtonId(id);
    try {
      setDeleteLoading(true);
      await deleteUsers(id).unwrap();
    } finally {
      setDeleteLoading(false);
    }
    refetch();
  };

  const handleEdit = async (id) => {
    setSelected(id);
    setIsModalOpen(true);
    const { data } = await getOneUsers(id);
    setPhoto(data?.photo);
    form.setFieldsValue(data);
  };

  const handlePhoto = async (e) => {
    try {
      setPhotoLoading(true);
      let formData = new FormData();
      formData.append("file", e.file.originFileObj);
      const { data } = await uploadPhoto(formData);
      setPhoto(data);
    } finally {
      setPhotoLoading(false);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => <Avatar src={userImage(photo)} alt="avatar" />,
    },
    {
      title: "Full name",
      dataIndex: "firstName",
      key: "firstName",
      render: (firstName, row) => (
        <p>
          {firstName} {row.lastName}
        </p>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <p>{role}</p>,
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <Space size="middle">
          <Button
            className="bg-primary"
            type="primary"
            onClick={() => handleEdit(id)}
          >
            Change role
          </Button>
          <Button
            className="bg-primary"
            type="primary"
            onClick={() => handleEdit(id)}
          >
            Edit
          </Button>
          {loadingButtonId === id ? (
            <Button
              className="bg-primary"
              type="primary"
              danger
              loading={deleteLoading}
              onClick={() => handleDelete(id)}
            >
              Delete
            </Button>
          ) : (
            <Button type="primary" danger onClick={() => handleDelete(id)}>
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <Table
        scroll={{
          x: 1000,
        }}
        title={() => (
          <Flex justify="space-between" gap={36} align="center">
            <h1>Users ({total})</h1>
            <Input
              value={search}
              onChange={handleSearch}
              style={{ width: "auto", flexGrow: 1 }}
              placeholder="Searching..."
            />
            <Button onClick={showModal} type="dashed">
              Add user
            </Button>
          </Flex>
        )}
        pagination={false}
        loading={isFetching}
        dataSource={users}
        columns={columns}
      />
      {total > LIMIT ? (
        <Pagination
          total={total}
          pageSize={LIMIT}
          current={page}
          onChange={(page) => setPage(page)}
        />
      ) : null}

      <Modal
        title="User data"
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add user" : "Save user"}
        okType="default"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="user"
          autoComplete="off"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            onChange={handlePhoto}
          >
            {photo ? (
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                src={userImage(photo)}
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

          <Form.Item
            label="Firs name"
            name="firstName"
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
            label="Last name"
            name="lastName"
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
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Info" name="info">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Fields" name="fields">
            <Input />
          </Form.Item>

          <Form.Item label="Phone number" name="phoneNumber">
            <Input />
          </Form.Item>

          <Form.Item label="Birthday" name="birthday">
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="Github" name="github">
            <Input />
          </Form.Item>

          <Form.Item label="Linkedin" name="linkedin">
            <Input />
          </Form.Item>

          <Form.Item label="Telegram" name="telegram">
            <Input />
          </Form.Item>

          <Form.Item label="Instagram" name="instagram">
            <Input />
          </Form.Item>

          <Form.Item label="Youtube" name="youtube">
            <Input />
          </Form.Item>

          <Form.Item label="Facebook" name="facebook">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default UsersPage;
