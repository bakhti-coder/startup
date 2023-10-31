import { useState } from "react";
import { useGetMessagesQuery } from "../../../redux/queries/messages";
import "./style.scss";
import { Flex, Input, Pagination } from "antd";
import MessagesCard from "../../../components/card/messagesCard";
import { LIMIT } from "../../../constants";
import Loading from "../../../components/shared/Loading";

const MessagesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: { messages, total } = { messages: [], total: 0 },
    isFetching,
    refetch,
  } = useGetMessagesQuery({ page, search });

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <Flex justify="space-between" gap={36} align="center">
        <h1>Messages ({total})</h1>
        <Input
          value={search}
          onChange={handleSearch}
          style={{ width: "auto", flexGrow: 1 }}
          placeholder="Searching..."
        />
      </Flex>
      <div>
        {isFetching ? (
          <Loading />
        ) : (
          messages.map((message) => (
            <MessagesCard key={message._id} {...message} />
          ))
        )}
      </div>
      {total > LIMIT ? (
        <Pagination
          total={total}
          pageSize={LIMIT}
          current={page}
          onChange={(page) => setPage(page)}
        />
      ) : null}
    </div>
  );
};

export default MessagesPage;
