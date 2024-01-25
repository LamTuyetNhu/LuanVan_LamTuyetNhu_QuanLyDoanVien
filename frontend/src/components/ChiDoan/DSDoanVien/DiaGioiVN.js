// VietnamBoundary.js
import axios from "axios";

const loadVietnamBoundary = async () => {
  try {
    const response = await axios.get(
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
    );
    return response.data;
  } catch (error) {
    console.error("Error loading Vietnam boundary data:", error);
    return null;
  }
};

export default loadVietnamBoundary;
