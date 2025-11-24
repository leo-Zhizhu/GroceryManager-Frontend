export const login = (credentials) => {
  const loginUrl = `/login?username=${credentials.username}&password=${credentials.password}`;

  return fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status < 200 || response.status >= 300) {
      return response.text().then((text) => {
        throw Error(`Fail to log in: ${response.status} - ${text || response.statusText}`);
      });
    }
    return response;
  }).catch((error) => {
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      throw Error("Cannot connect to server. Please check if the backend is running and CORS is configured.");
    }
    throw error;
  });
};

export const signup = (data) => {
  const signupUrl = "/signup";

  return fetch(signupUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status < 200 || response.status >= 300) {
      return response.text().then((text) => {
        throw Error(`Fail to sign up: ${response.status} - ${text || response.statusText}`);
      });
    }
    return response;
  }).catch((error) => {
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      throw Error("Cannot connect to server. Please check if the backend is running and CORS is configured.");
    }
    throw error;
  });
};

export const getGroceryLists = () => {
  return fetch("/grocery-lists").then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw Error("Fail to get grocery lists");
    }

    return response.json();
  });
};

export const createGroceryList = (listName) => {
  const payload = {
    name: listName,
  };

  return fetch("/grocery-lists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw Error("Fail to create grocery list");
    }
  });
};

export const deleteGroceryList = (listId) => {
  return fetch(`/grocery-lists/${listId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw Error("Fail to delete grocery list");
    }
  });
};

export const getAvailableItems = () => {
  return fetch("/items").then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw Error("Fail to get available items");
    }

    return response.json();
  });
};

export const getGroceryListItems = (listId) => {
  return fetch(`/grocery-lists/${listId}/items`).then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw Error("Fail to get grocery list items");
    }

    return response.json();
  });
};

export const addItemToGroceryList = (listId, itemId) => {
  const payload = {
    item_id: itemId,
  };

  return fetch(`/grocery-lists/${listId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw Error("Fail to add item to grocery list");
    }
  });
};

export const deleteItemFromGroceryList = (listId, itemId) => {
  return fetch(`/grocery-lists/${listId}/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw Error("Fail to delete item from grocery list");
    }
  });
};

export const getBalance = () => {
  return fetch("/balance").then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw Error("Fail to get balance");
    }

    return response.json();
  });
};

export const addMoney = (amount) => {
  const payload = {
    amount: amount,
  };

  return fetch("/balance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw Error("Fail to add money");
    }
  });
};

export const getGroceryListsCost = () => {
  return fetch("/grocery-lists/cost").then((response) => {
    if (response.status < 200 || response.status >= 300) {
      throw Error("Fail to get grocery lists cost");
    }

    return response.json();
  });
};

