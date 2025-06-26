import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function useQuery() {
    return new URLSearchParams(window.location.search);
}

function queryToObject(query: URLSearchParams) {
    const obj: Record<string, string> = {};
    for (const [key, value] of query.entries()) {
        obj[key] = value;
    }
    return obj;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const VnpayReturn: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [message, setMessage] = useState("Đang xác thực thanh toán...");
    const [error, setError] = useState("");

    useEffect(() => {
        const allParams = queryToObject(query);
        const payload = {
            vnp_TxnRef: allParams["vnp_TxnRef"],
            vnp_TransactionNo: allParams["vnp_TransactionNo"],
            vnp_ResponseCode: allParams["vnp_ResponseCode"],
            vnp_SecureHash: allParams["vnp_SecureHash"],
            allParams,
        };

        fetch(`${API_BASE_URL}/payment/verify-vnpay-return`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                if (payload.vnp_ResponseCode === "00") {
                    setStatus("success");
                    setMessage(
                        "Thanh toán thành công! Đang chuyển về trang cá nhân..."
                    );
                    setTimeout(() => {
                        navigate("/profile");
                    }, 2000);
                } else {
                    setStatus("error");
                    setMessage("Thanh toán thất bại!");
                    setError("Mã lỗi: " + payload.vnp_ResponseCode);
                }
            })
            .catch(() => {
                setStatus("error");
                setMessage("Có lỗi khi xác thực thanh toán!");
                setError("Không thể kết nối tới máy chủ xác thực.");
            });
    }, [query, navigate]);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8fafc",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    padding: 40,
                    minWidth: 340,
                    textAlign: "center",
                }}
            >
                {status === "loading" && (
                    <>
                        <Loader2
                            className="animate-spin"
                            size={56}
                            color="#0ea5e9"
                            style={{ margin: "0 auto 16px" }}
                        />
                        <h2
                            style={{
                                color: "#0ea5e9",
                                fontWeight: 700,
                                fontSize: 24,
                            }}
                        >
                            {message}
                        </h2>
                    </>
                )}
                {status === "success" && (
                    <>
                        <CheckCircle2
                            size={56}
                            color="#22c55e"
                            style={{ margin: "0 auto 16px" }}
                        />
                        <h2
                            style={{
                                color: "#22c55e",
                                fontWeight: 700,
                                fontSize: 24,
                            }}
                        >
                            {message}
                        </h2>
                    </>
                )}
                {status === "error" && (
                    <>
                        <XCircle
                            size={56}
                            color="#ef4444"
                            style={{ margin: "0 auto 16px" }}
                        />
                        <h2
                            style={{
                                color: "#ef4444",
                                fontWeight: 700,
                                fontSize: 24,
                            }}
                        >
                            {message}
                        </h2>
                        {error && (
                            <p style={{ color: "#ef4444", marginTop: 8 }}>
                                {error}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default VnpayReturn;
