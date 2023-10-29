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

import {
  useCreateExperiencesMutation,
  useDeleteExperiencesMutation,
  useGetExperiencesQuery,
  useGetOneExperiencesMutation,
  useUpdateExperiencesMutation,
} from "../../../redux/queries/experience";
import { LIMIT } from "../../../constants";

const ExperiencesPage = () => {
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
    data: { experience, total } = { experience: [], total: 0 },
    isFetching,
    refetch,
  } = useGetExperiencesQuery({ page, search });

  const [createExperiences] = useCreateExperiencesMutation();
  const [getOneExperiences] = useGetOneExperiencesMutation();
  const [updateExperiences] = useUpdateExperiencesMutation();
  const [deleteExperiences] = useDeleteExperiencesMutation();

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
        await createExperiences(values).unwrap();
      } else {
        await updateExperiences({ id: selected, body: values }).unwrap();
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
      await deleteExperiences(id).unwrap();
    } finally {
      setDeleteLoading(false);
    }
    refetch();
  };

  const handleEdit = async (id) => {
    setSelected(id);
    setIsModalOpen(true);
    const { data } = await getOneExperiences(id);
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
      title: "Work name",
      dataIndex: "workName",
      key: "workName",
    },
    {
      title: "Company name",
      dataIndex: "companyName",
      key: "companyName",
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
            <h1>Experiences ({total})</h1>
            <Input
              value={search}
              onChange={handleSearch}
              style={{ width: "auto", flexGrow: 1 }}
              placeholder="Searching..."
            />
            <Button onClick={showModal} type="dashed">
              Add experience
            </Button>
          </Flex>
        )}
        pagination={false}
        loading={isFetching}
        dataSource={experience}
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
        title="Category data"
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add skill" : "Save skill"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="category"
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
            label="Work name"
            name="workName"
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
            label="Company name"
            name="companyName"
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

export default ExperiencesPage;
