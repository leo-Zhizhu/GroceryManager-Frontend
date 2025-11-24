import { Card, Button, message, Modal, Select, Popconfirm } from "antd";
import React, { useState, useEffect } from "react";
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { getGroceryListItems, getAvailableItems, addItemToGroceryList, deleteItemFromGroceryList } from "../utils";

const ListForm = (props) => {
  const { listId, listName, onBack } = props;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingAvailableItems, setLoadingAvailableItems] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [addingItem, setAddingItem] = useState(false);

  const loadItems = () => {
    if (listId) {
      setLoading(true);
      getGroceryListItems(listId)
        .then((data) => {
          console.log("Items data received from backend:", data);
          if (data && data.length > 0) {
            console.log("First item structure:", data[0]);
            console.log("First item keys:", Object.keys(data[0]));
          }
          setItems(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching items:", err);
          message.error(err.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadItems();
  }, [listId]);

  const handleAddItem = () => {
    setIsAddModalVisible(true);
    setLoadingAvailableItems(true);
    getAvailableItems()
      .then((data) => {
        console.log("Available items:", data);
        setAvailableItems(data);
        setLoadingAvailableItems(false);
      })
      .catch((err) => {
        console.error("Error fetching available items:", err);
        message.error(err.message);
        setLoadingAvailableItems(false);
      });
  };

  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setSelectedItemId(null);
  };

  const handleAddItemSubmit = () => {
    if (!selectedItemId) {
      message.warning("Please select an item to add");
      return;
    }

    setAddingItem(true);
    addItemToGroceryList(listId, selectedItemId)
      .then(() => {
        message.success("Item added successfully!");
        setIsAddModalVisible(false);
        setSelectedItemId(null);
        loadItems(); 
        setAddingItem(false);
      })
      .catch((err) => {
        message.error(err.message);
        setAddingItem(false);
      });
  };

  const handleDeleteItem = (itemId) => {
    // Use item.item_id (global item ID) for deletion, not item.id
    deleteItemFromGroceryList(listId, itemId)
      .then(() => {
        message.success("Item deleted successfully!");
        loadItems(); // Refresh the items list
      })
      .catch((err) => {
        message.error(err.message);
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
          <h2 style={{ margin: 0 }}>{listName || "Grocery List"}</h2>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddItem}
        >
          Add Item
        </Button>
      </div>

      <Modal
        title="Add Item to List"
        open={isAddModalVisible}
        onCancel={handleModalCancel}
        onOk={handleAddItemSubmit}
        confirmLoading={addingItem}
        okText="Add Item"
      >
        <Select
          style={{ width: "100%", marginTop: "16px" }}
          placeholder="Select an item to add"
          value={selectedItemId}
          onChange={setSelectedItemId}
          loading={loadingAvailableItems}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={availableItems.map((item) => {
            const itemId = item.id || item.item_id;
            const itemName = item.name || item.item_name || "Unknown Item";
            return {
              value: itemId,
              label: itemName,
            };
          })}
        />
      </Modal>

      {loading ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
          {[1, 2, 3].map((i) => (
            <Card key={i} loading={true} style={{ width: "320px" }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ color: "#8c8c8c" }}>No items in this list yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
          {items.map((item) => {
            const imageUrl = item.image_url;
            const itemName = item.item_name || "Unknown Item";
            const itemPrice = item.item_price || 0;
            const quantity = item.quantity || 0;
            const totalPrice = item.total_price || 0;
            // Use item.item_id (global item ID) for deletion, not item.id
            const globalItemId = item.item_id;
            
            return (
              <Card
                key={item.id || item.item_id}
                style={{ width: "320px" }}
                cover={
                  imageUrl ? (
                    <img
                      alt={itemName}
                      src={imageUrl}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/320x200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "200px",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8c8c8c",
                      }}
                    >
                      No Image
                    </div>
                  )
                }
                actions={[
                  <Popconfirm
                    title="Delete item"
                    description="Are you sure you want to delete this item?"
                    onConfirm={() => handleDeleteItem(globalItemId)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      style={{ width: "100%" }}
                    >
                      Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <div>
                  <h3 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: 600 }}>
                    {itemName}
                  </h3>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Unit Price:</strong> ${typeof itemPrice === "number" ? itemPrice.toFixed(2) : itemPrice || "0.00"}
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Quantity:</strong> {quantity}
                  </div>
                  <div>
                    <strong>Total Price:</strong> ${typeof totalPrice === "number" ? totalPrice.toFixed(2) : totalPrice || "0.00"}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListForm;

