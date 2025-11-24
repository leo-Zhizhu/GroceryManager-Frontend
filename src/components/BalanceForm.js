import { Card, Button, message, Table, Modal, Form, InputNumber } from "antd";
import React, { useState, useEffect } from "react";
import { ArrowLeftOutlined, DollarOutlined, PlusOutlined } from "@ant-design/icons";
import { getBalance, getGroceryListsCost, addMoney } from "../utils";

const BalanceForm = (props) => {
  const { onBack } = props;
  const [balance, setBalance] = useState(null);
  const [listCosts, setListCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddMoneyModalVisible, setIsAddMoneyModalVisible] = useState(false);
  const [addingMoney, setAddingMoney] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadBalanceData();
  }, []);

  const loadBalanceData = () => {
    setLoading(true);
    Promise.all([getBalance(), getGroceryListsCost()])
      .then(([balanceData, costsData]) => {
        setBalance(balanceData);
        setListCosts(costsData.lists || []);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.message);
        setListCosts([]);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "List Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (cost) => `$${typeof cost === "number" ? cost.toFixed(2) : cost || "0.00"}`,
    },
  ];

  const totalCost = listCosts.reduce((sum, list) => sum + (list.total_price || 0), 0);

  const handleAddMoney = () => {
    setIsAddMoneyModalVisible(true);
  };

  const handleAddMoneyModalCancel = () => {
    setIsAddMoneyModalVisible(false);
    form.resetFields();
  };

  const handleAddMoneySubmit = (values) => {
    const amount = values.amount;
    
    if (amount < 0) {
      message.error("Amount must be a non-negative number");
      return;
    }

    setAddingMoney(true);
    addMoney(amount)
      .then(() => {
        message.success(`Successfully added $${amount.toFixed(2)} to your balance!`);
        setIsAddMoneyModalVisible(false);
        form.resetFields();
        loadBalanceData(); 
        setAddingMoney(false);
      })
      .catch((err) => {
        message.error(err.message);
        setAddingMoney(false);
      });
  };

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            style={{ marginRight: "16px" }}
          >
            Back
          </Button>
          <h2 style={{ margin: 0 }}>Account Balance</h2>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMoney}>
          Add Money
        </Button>
      </div>

      {loading ? (
        <Card loading={true} style={{ marginBottom: "24px" }} />
      ) : (
        <>
          <Card
            style={{ marginBottom: "24px" }}
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <DollarOutlined style={{ marginRight: "8px", fontSize: "20px", color: "#1890ff" }} />
                Current Balance
              </div>
            }
          >
            <div style={{ fontSize: "32px", fontWeight: 600, color: "#1890ff" }}>
              ${typeof balance === "object" && balance.balance !== undefined
                ? (typeof balance.balance === "number" ? balance.balance.toFixed(2) : balance.balance)
                : typeof balance === "number"
                ? balance.toFixed(2)
                : balance || "0.00"}
            </div>
          </Card>

          <Modal
            title="Add Money to Account"
            open={isAddMoneyModalVisible}
            onCancel={handleAddMoneyModalCancel}
            footer={null}
            destroyOnClose={true}
          >
            <Form
              form={form}
              onFinish={handleAddMoneySubmit}
              layout="vertical"
            >
              <Form.Item
                name="amount"
                label="Amount"
                rules={[
                  { required: true, message: "Please input the amount!" },
                  {
                    validator: (_, value) => {
                      if (value === undefined || value === null) {
                        return Promise.resolve();
                      }
                      if (value < 0) {
                        return Promise.reject(new Error("Amount must be a non-negative number"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter amount"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="$"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={addingMoney}>
                  Add Money
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Card title="Grocery Lists Cost">
            <Table
              columns={columns}
              dataSource={listCosts.map((list) => ({
                key: list.list_id,
                name: list.list_name,
                cost: list.total_price || 0,
              }))}
              pagination={false}
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <strong>Total Cost</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>${totalCost.toFixed(2)}</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default BalanceForm;

