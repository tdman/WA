import React, { useState } from "react";

const items = [
    { id: 1, name: "무지개 뱃지", emoji: "🌈", price: 100, desc: "알록달록 무지개 뱃지야!" },
    { id: 2, name: "별 스티커", emoji: "⭐️", price: 50, desc: "반짝반짝 별 스티커!" },
    { id: 3, name: "행운 쿠폰", emoji: "🍀", price: 200, desc: "오늘은 행운이 가득~" },
    { id: 4, name: "귀여운 연필", emoji: "✏️", price: 80, desc: "공부할 때 쓰면 더 잘 써져!" },
    { id: 5, name: "토끼 인형", emoji: "🐰", price: 300, desc: "폭신폭신 귀여운 토끼 인형!" },
];

export default function RewardShop() {
    const [cart, setCart] = useState([]);
    const [message, setMessage] = useState("");

    const addToCart = (item) => {
        setCart([...cart, item]);
        setMessage(`${item.emoji} ${item.name} 장바구니에 담았어!`);
    };

    const buyItems = () => {
        if (cart.length === 0) {
            setMessage("장바구니가 비었어! 원하는 아이템을 담아줘~");
            return;
        }
        setMessage("구매 완료! 멋진 보상들이 너를 기다려~ 🎉");
        setCart([]);
    };

    return (
        <div style={{
            maxWidth: 420,
            margin: "40px auto",
            padding: 24,
            border: "4px solid #ffe066",
            borderRadius: 18,
            background: "#fffbe6",
            fontFamily: "'Jua', sans-serif",
            boxShadow: "0 4px 16px #ffe06655"
        }}>
            <h2 style={{ color: "#ff922b", textAlign: "center", fontSize: 32, marginBottom: 16 }}>🎁 보상 상점</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {items.map((item) => (
                    <li key={item.id} style={{
                        background: "#fff",
                        borderRadius: 12,
                        marginBottom: 14,
                        padding: "14px 12px",
                        display: "flex",
                        alignItems: "center",
                        boxShadow: "0 2px 8px #ffd43b33"
                    }}>
                        <span style={{ fontSize: 32, marginRight: 14 }}>{item.emoji}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "bold", fontSize: 18, color: "#fab005" }}>{item.name}</div>
                            <div style={{ fontSize: 14, color: "#868e96" }}>{item.desc}</div>
                        </div>
                        <div style={{ marginLeft: 10, textAlign: "right" }}>
                            <div style={{ color: "#40c057", fontWeight: "bold" }}>{item.price}점</div>
                            <button
                                style={{
                                    background: "#ffd43b",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "6px 14px",
                                    fontWeight: "bold",
                                    color: "#fff",
                                    cursor: "pointer",
                                    marginTop: 4,
                                    fontSize: 15,
                                    boxShadow: "0 1px 4px #ffe06655"
                                }}
                                onClick={() => addToCart(item)}
                            >
                                담기
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <h3 style={{ color: "#ff922b", marginTop: 24 }}>🛒 장바구니</h3>
            <ul style={{ minHeight: 32, marginBottom: 8 }}>
                {cart.length === 0 ? <li style={{ color: "#adb5bd" }}>아직 없음</li> : cart.map((item, idx) => <li key={idx}>{item.emoji} {item.name}</li>)}
            </ul>
            <button
                onClick={buyItems}
                style={{
                    width: "100%",
                    background: "#ff922b",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 18,
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 0",
                    marginTop: 8,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px #ffd43b33"
                }}
            >
                구매하기
            </button>
            {message && <div style={{ marginTop: 18, color: "#845ef7", fontSize: 17, textAlign: "center" }}>{message}</div>}
        </div>
    );
}