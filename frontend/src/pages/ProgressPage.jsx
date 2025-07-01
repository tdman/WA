import React, {useEffect, useState} from "react";
import {Box, CircularProgress, Container, Divider, Paper, Typography} from "@mui/material";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";
import LogoutButton from "../components/LogoutButton.jsx";


function Progress() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [summary, setSummary] = useState("");
    const [details, setDetails] = useState({});
    const studentId = "STU1";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(`http://localhost:55500/auth/${studentId}/progress`);
                const rawText = res.data?.content?.[0]?.text?.trim();

                const cleanedText = rawText
                    .replace(/^```json/, "")
                    .replace(/^```/, "")
                    .replace(/```$/, "")
                    .trim();

                const parsed = JSON.parse(cleanedText);

                setChartData(parsed.chart_data || []);
                setSummary(parsed.summary || "");
                setDetails(parsed.details || {});
            } catch (err) {
                console.error("JSON 파싱 실패:", err);
                setError("AI 응답이 올바른 JSON 형식이 아닙니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 10 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>분석 결과를 불러오는 중...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: "center", mt: 10 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <BackButton />
                <LogoutButton />
            </Box>
            <Box sx={{ maxWidth: 1000, mx: "auto", mt: 5, px: 2 }}>
                <Typography variant="h5" gutterBottom>
                    📊 최근 1주일 AI 학습 분석 리포트
                </Typography>

                {/* ✅ 상단: 좌측 차트 + 우측 요약 (flex 레이아웃) */}
                <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
                    {/* 차트 영역: flex-grow 3 → 더 넓게 */}
                    <Paper
                        elevation={3}
                        sx={{
                            flex: 1,
                            minWidth: 300,
                            p: 2
                        }}
                    >
                        <Typography variant="subtitle1" gutterBottom>
                            주요 취약 영역
                        </Typography>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="errors" fill="#f44336" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                차트로 표시할 취약 영역이 없습니다.
                            </Typography>
                        )}
                    </Paper>

                    {/* 요약 영역: flex-grow 1 */}
                    <Paper
                        elevation={3}
                        sx={{
                            flex: 2,
                            minWidth: 200,
                            p: 2
                        }}
                    >
                        <Typography variant="subtitle1" gutterBottom>
                            핵심 요약
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                            {summary}
                        </Typography>
                    </Paper>
                </Box>


                {/* ✅ 하단: 세부 분석 */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        📌 세부 영역별 학습 전략
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {Object.entries(details).map(([area, tip], index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="primary">
                                ▪ {area}
                            </Typography>
                            <Typography variant="body2">{tip}</Typography>
                        </Box>
                    ))}
                </Paper>
            </Box>
        </Container>
    );
}

export default Progress;
