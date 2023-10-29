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
  DatePicker,
} from "antd";
const { RangePicker } = DatePicker;

import { LIMIT } from "../../../constants";
import {
  useCreateEducationMutation,
  useDeleteEducationMutation,
  useGetEducationQuery,
  useGetOneEducationMutation,
  useUpdateEducationMutation,
} from "../../../redux/queries/education";

const EducationPage = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loadingButtonId, setLoadingButtonId] = useState(null);

  const {
    data: { education, total } = { education: [], total: 0 },
    isFetching,
    refetch,
  } = useGetEducationQuery({ page, search });

  const [createEducation] = useCreateEducationMutation();
  const [getOneEducation] = useGetOneEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
    setSelected(null);
    startDate(null);
    endDate(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      setIsModalLoading(true);
      const values = await form.validateFields();
      values.startDate = startDate;
      values.endDate = endDate;
      if (selected === null) {
        await createEducation(values).unwrap();
      } else {
        await updateEducation({ id: selected, body: values }).unwrap();
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
      await deleteEducation(id).unwrap();
    } finally {
      setDeleteLoading(false);
    }
    refetch();
  };

  const handleEdit = async (id) => {
    setSelected(id);
    setIsModalOpen(true);
    const { data } = await getOneEducation(id);
    form.setFieldsValue(data);
  };

  const handleDate = ([startDate, endDate]) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const onOk = (value) => {
    console.log("onOk: ", value);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => <p>{startDate.split("T")[0]}</p>,
    },
    {
      title: "End date",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => <p>{endDate.split("T")[0]}</p>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => <p>{description.slice(0, 20)}...</p>,
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(id)}>
            Edit
          </Button>
          {loadingButtonId === id ? (
            <Button
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
            <h1>Education ({total})</h1>
            <Input
              value={search}
              onChange={handleSearch}
              style={{ width: "auto", flexGrow: 1 }}
              placeholder="Searching..."
            />
            <Button onClick={showModal} type="dashed">
              Add education
            </Button>
          </Flex>
        )}
        pagination={false}
        loading={isFetching}
        dataSource={education}
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
        title="Education data"
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add education" : "Save education"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="education"
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
            label="Lavel"
            name="level"
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
            <Input.TextArea />
          </Form.Item>

          <RangePicker
            showTime={{
              format: "HH:mm",
            }}
            format="YYYY-MM-DD HH:mm"
            onChange={handleDate}
            onOk={onOk}
          />
        </Form>
      </Modal>
    </Fragment>
  );
};

export default EducationPage;
