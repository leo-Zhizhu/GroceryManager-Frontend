import { Card, Button, message, Modal, Form, Input, Popconfirm } from "antd";
import React, { useState, useEffect } from "react";
import { ShoppingOutlined, PlusOutlined, DeleteOutlined, DollarOutlined } from "@ant-design/icons";
import { getGroceryLists, createGroceryList, deleteGroceryList } from "../utils";
import ListForm from "./ListForm";
import BalanceForm from "./BalanceForm";

const GroceryForm = (props) => {
  const [groceryLists, setGroceryLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const [form] = Form.useForm();

  const loadGroceryLists = () => {
    setLoading(true);
    getGroceryLists()
      .then((data) => {
        console.log("Grocery lists data:", data);
        setGroceryLists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadGroceryLists();
  }, []);

  const handleViewDetails = (listId, listName) => {
    setSelectedList({ id: listId, name: listName });
  };

  const handleBackToList = () => {
    setSelectedList(null);
    loadGroceryLists(); 
  };

  const handleViewBalance = () => {
    setShowBalance(true);
  };

  const handleBackFromBalance = () => {
    setShowBalance(false);
  };

  const handleCreateList = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    loadGroceryLists();
  };

  const handleModalOk = (values) => {
    createGroceryList(values.name)
      .then(() => {
        message.success("Grocery list created successfully!");
        setIsModalVisible(false);
        form.resetFields();
        loadGroceryLists();
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const handleDeleteList = (listId, listName) => {
    deleteGroceryList(listId)
      .then(() => {
        message.success(`Grocery list "${listName}" deleted successfully!`);
        loadGroceryLists();
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  if (selectedList) {
    return <ListForm listId={selectedList.id} listName={selectedList.name} onBack={handleBackToList} />;
  }

  if (showBalance) {
    return <BalanceForm onBack={handleBackFromBalance} />;
  }

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <h2>My Grocery Lists</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button icon={<DollarOutlined />} onClick={handleViewBalance}>
            View Balance
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateList}>
            Create New List
          </Button>
        </div>
      </div>

      <Modal
        title="Create New Grocery List"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleModalOk} layout="vertical">
          <Form.Item
            name="name"
            label="List Name"
            rules={[{ required: true, message: "Please input the grocery list name!" }]}
          >
            <Input placeholder="Enter grocery list name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create List
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {loading ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} loading={true} style={{ width: "280px" }} />
          ))}
        </div>
      ) : groceryLists.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <ShoppingOutlined style={{ fontSize: "64px", color: "#d9d9d9", marginBottom: "16px" }} />
          <p style={{ color: "#8c8c8c" }}>No grocery lists found. Create your first list!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
          {groceryLists.map((list) => (
            <Card
              key={list.id}
              hoverable
              style={{ width: "280px" }}
              actions={[
                <Button type="link" onClick={() => handleViewDetails(list.id, list.name)}>
                  View Details
                </Button>,
                <Popconfirm
                  title="Delete grocery list"
                  description={`Are you sure you want to delete "${list.name}"?`}
                  onConfirm={() => handleDeleteList(list.id, list.name)}
                  okText="Yes"
                  cancelText="No"
                  okType="danger"
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <div style={{ textAlign: "center" }}>
                <ShoppingOutlined style={{ fontSize: "40px", color: "#1890ff", marginBottom: "16px" }} />
                <h3 style={{ marginBottom: "8px", wordBreak: "break-word" }}>{list.name}</h3>
                <p style={{ color: "#8c8c8c", margin: 0 }}>
                  {list.total_items} {list.total_items > 1 ? "item" : "items"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroceryForm;

