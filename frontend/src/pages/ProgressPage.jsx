import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Divider,
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import axios from "axios";

// ✅ Claude 응답 text에서 취약 영역 추출
function extractWeakAreasFromClaudeText(text) {
    const weakAreas = new Set();
    const regex = /([가-힣\s]+?)\s*(분야|문제|영역)에서 (어려움을 겪|오답 비율|취약)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        const area = match[1].trim();
        if (area) weakAreas.add(area);
    }

    return Array.from(weakAreas).map((area) => ({
        name: area,
        errors: 1,
    }));
}

function Progress() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summaryText, setSummaryText] = useState("");
    const [chartData, setChartData] = useState([]);
    const studentId = "STU1";

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await axios.post(
                    `http://localhost:55500/auth/${studentId}/progress`
                );
                const text = res.data?.content?.[0]?.text;

                if (text) {
                    setSummaryText(text);
                    const parsed = extractWeakAreasFromClaudeText(text);
                    setChartData(parsed);
                } else {
                    setError("AI 분석 결과가 비어 있습니다.");
                }
            } catch (err) {
                console.error(err);
                setError("분석 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
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
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, px: 2 }}>
            <Typography variant="h5" gutterBottom>
                📊 최근 1주일 AI 학습 분석
            </Typography>

            {/* 요약 텍스트 */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, whiteSpace: "pre-line" }}>
                <Typography variant="body1">{summaryText}</Typography>
            </Paper>

            {/* 차트 시각화 */}
            <Typography variant="h6" gutterBottom>
                📉 주요 취약 영역
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
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
                        시각화 가능한 취약 영역 정보가 없습니다.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
}

export default Progress;
