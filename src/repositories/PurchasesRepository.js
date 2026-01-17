import axios from "axios";
import { useSessionStore } from "@/stores/session";

const baseUrl = "https://localhost:5000/api/purchase";

export async function addPurchase(purchase) {
  const session = useSessionStore();

  try {
    const response = await axios.post(baseUrl, purchase, {
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 201) {
      return {
        success: true,
        data: response.data,
        msg: "La compra se ha realizado exitosamente",
      };
    }

    return {
      success: false,
      msg: response.data.msg,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.msg || "Error de conexión",
    };
  }
}
