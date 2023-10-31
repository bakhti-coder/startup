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
  Checkbox,
  Select,
} from "antd";

import { LIMIT, USERTOTAL } from "../../../constants";
import {
  useChangeRoleUsersMutation,
  useCreateUsersMutation,
  useDeleteUsersMutation,
  useGetOneUsersMutation,
  useGetUsersQuery,
  useUpdateUsersMutation,
  useUploadPhotoMutation,
} from "../../../redux/queries/users";
import { userImage } from "../../../utils/getImage";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";

import "./style.scss";
import Cookies from "js-cookie";

const UsersPage = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loadingButtonId, setLoadingButtonId] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [loadingRole, setLoadingRole] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("all");

  // if (role === "all") {
  // }

  const {
    data: { users, total } = { users: [], total: 0 },
    isFetching,
    refetch,
  } = useGetUsersQuery({
    page,
    search,
    role: role !== "all" ? role : undefined,
  });
  Cookies.set(USERTOTAL, total);

  const [createUsers] = useCreateUsersMutation();
  const [getOneUsers] = useGetOneUsersMutation();
  const [uploadPhoto] = useUploadPhotoMutation();
  const [updateUsers] = useUpdateUsersMutation();
  const [deleteUsers] = useDeleteUsersMutation();
  const [changeRoleUser] = useChangeRoleUsersMutation();

  const showModal = () => {
    setIsModalOpen(true);
    setPhoto(null);
    setSelected(null);
    form.resetFields();
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
    setPhoto(null);
    try {
      setPhotoLoading(true);
      let formData = new FormData();
      formData.append("file", e.file.originFileObj);
      const { data } = await uploadPhoto(formData).unwrap();
      setPhoto(data);
    } finally {
      setPhotoLoading(false);
    }
  };

  const changeRole = async (id, e) => {
    try {
      setLoadingRole(true);
      if (e) {
        const client = "client";
        await changeRoleUser({ id, body: client }).unwrap();
        refetch();
      } else {
        const user = "user";
        await changeRoleUser({ id, body: user }).unwrap();
        refetch();
      }
    } finally {
      setLoadingRole(false);
    }
  };

  const handleChange = (value) => {
    setRole(value);
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
      render: (id, row) => (
        <Space size="middle">
          {/* {roleIdLoading === id && loadingRole ? (
            "Loading..."
          ) : ( */}
          <Checkbox
            checked={row.role === "user" ? false : true}
            disabled={row.role === "admin" || loadingRole}
            onChange={(e) => changeRole(row._id, e.target.checked)}
          >
            Change role {row.role === "user" ? "client" : "user"}
          </Checkbox>
          {/* )} */}

          <Button
            className="bg-primary"
            type="primary"
            onClick={() => handleEdit(id)}
          >
            Edit
          </Button>
          {loadingButtonId === id ? (
            <Button
              disabled={row.role === "admin" ? true : false}
              className="bg-primary"
              type="primary"
              danger
              loading={deleteLoading}
              onClick={() => handleDelete(id)}
            >
              Delete
            </Button>
          ) : (
            <Button
              disabled={row.role === "admin" ? true : false}
              type="primary"
              danger
              onClick={() => handleDelete(id)}
            >
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
            <Select
              defaultValue="All"
              style={{
                width: 120,
              }}
              onChange={handleChange}
              options={[
                {
                  value: "all",
                  label: "All role",
                },
                {
                  value: "client",
                  label: "Clients role",
                },
                {
                  value: "user",
                  label: "Users role",
                },
              ]}
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
            name="image"
            listType="picture-card"
            className="image-uploader"
            showUploadList={false}
            onChange={handlePhoto}
          >
            {photo ? (
              <LazyLoadImage
                effect="blur"
                style={{
                  width: "100%",
                  height: "378px",
                  objectFit: "cover",
                }}
                src={userImage(photo)}
                alt="image"
              />
            ) : (
              <div>
                {photoLoading ? <LoadingOutlined /> : <PlusOutlined />}
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  {photoLoading
                    ? "Loading..."
                    : selected === null
                    ? "Add photo"
                    : "Change photo"}
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
