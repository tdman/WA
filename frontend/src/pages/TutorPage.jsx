import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

function TutorPage({ onClose, onTutorSelect }) {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:55500/tutors/all")
            .then(res => res.json())
            .then(data => {
                if (data && data.payload) setTutors(data.payload);
            })
            .catch(err => console.error("튜터 목록 불러오기 실패:", err))
            .finally(() => setLoading(false));
    }, []);

    // 2열 그리드에서 마지막 열은 borderRight 제거
    const isLastCol = (idx, arr) => (idx % 2 === 1) || (arr.length % 2 === 1 && idx === arr.length - 1);

    return (
        <Box sx={{ p: 0 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: "#222", fontSize: 22 }}>
                튜터 목록
            </Typography>
            <Grid container spacing={2}>
                {(loading ? Array.from({ length: 4 }) : tutors).map((tutor, idx, arr) => (
                    <Grid item xs={12} sm={6} key={idx}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                border: "1.5px solid #ececec",
                                borderRight: isLastCol(idx, arr) ? "none" : "1.5px solid #ececec",
                                borderBottom: (idx < arr.length - 2) ? "1.5px solid #ececec" : "none",
                                borderRadius: 2,
                                px: 3,
                                py: 2,
                                background: "#fff",
                                cursor: loading ? "default" : "pointer",
                                transition: "background 0.2s",
                                "&:hover": { background: "#f7f7f7" },
                                minHeight: 80,
                                boxSizing: "border-box",
                                width: "100%",
                            }}
                            onClick={() => {
                                if (!loading && tutor) {
                                    if (onTutorSelect) {
                                        onTutorSelect(tutor);
                                    } else {
                                        navigate(`/tutorDetail/${tutor.tutorId}`);
                                    }
                                }
                            }}
                        >
                            {loading ? (
                                <Skeleton variant="circular" width={48} height={48} />
                            ) : tutor?.profileImgBytes ? (
                                <img
                                    src={`data:image/png;base64,${tutor.profileImgBytes}`}
                                    alt="프로필"
                                    style={{
                                        width: 48,
                                        height: 48,
                                        objectFit: "cover",
                                        marginRight: 18,
                                        borderRadius: 6
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        background: "#f5f5f5",
                                        color: "#bbb",
                                        fontSize: 26,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 18,
                                        borderRadius: 6
                                    }}
                                >?</Box>
                            )}
                            <Box>
                                <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#222" }}>
                                    {loading ? <Skeleton width={70} /> : tutor?.name}
                                </Typography>
                                <Typography sx={{ fontSize: 15, color: "#1976d2", fontWeight: 400 }}>
                                    {loading ? <Skeleton width={40} /> : tutor?.tutorMbti}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default TutorPage;