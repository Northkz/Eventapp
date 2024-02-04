const loginUser = async (email, password) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const response = await fetch(`${apiUrl}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }

    localStorage.setItem("token", data.token); // Save the JWT in localStorage
    localStorage.setItem("email", JSON.stringify(data.email)); // Save the email in localStorage

    // send update request to server
    // POST /api/venue/updateVenues
    await sendUpdateRequest(data.token);
    return data; // Return the data
  } catch (error) {
    throw error;
  }
};

async function registerUser(email, password) {
  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const response = await fetch(`${apiUrl}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong!");
    }

    return data; // Return the response data
  } catch (error) {
    throw error;
  }
}

function logOut(navigate) {
  localStorage.removeItem("token");
}

async function sendUpdateRequest(token) {
  const apiUrl = process.env.REACT_APP_API_URL;
  try {
    const response = await fetch(`${apiUrl}/api/venue/updateVenues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach the token as Authorization header
      },
      body: JSON.stringify({}),
    });

    // response send plain text
    const data = await response.text();
    if (!response.ok) {
      throw new Error(data || "Something went wrong!");
    }

    return data; // Return the response data
  } catch (error) {
    throw error;
  }
}

export { loginUser, registerUser, logOut };
