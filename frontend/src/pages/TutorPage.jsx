import React, { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography,
    Container, Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import LogoutButton from "../components/LogoutButton";

function TutorPage() {
    const [tutors, setTutors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:55500/tutors/all")
            .then(res => res.json())
            .then(data => {
                if (data && data.payload) {
                    setTutors(data.payload);
                }
            })
            .catch(err => {
                console.error("튜터 목록 불러오기 실패:", err);
            });
    }, []);

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <BackButton />
                <LogoutButton />
            </Box>
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                    📘 튜터 목록
                </Typography>
                <TableContainer
                    component={Paper}
                    elevation={6}
                    sx={{ borderRadius: 4, boxShadow: 4 }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell sx={{ fontWeight: 600, fontSize: 18, padding: "8px 16px" }}>프로필 사진</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: 18, padding: "8px 16px" }}>이름</TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: 18, padding: "8px 16px" }}>MBTI</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tutors.map((tutor, idx) => (
                                <TableRow
                                    key={idx}
                                    hover
                                    sx={{
                                        cursor: 'pointer',
                                        transition: "background 0.2s",
                                        "&:hover": { backgroundColor: "#e3f2fd" }
                                    }}
                                    onClick={() => navigate(`/tutorDetail/${tutor.tutorId}`)}
                                >
                                    <TableCell>
                                        {tutor.profileImgBytes ? (
                                            <img
                                                src={`data:image/png;base64,${tutor.profileImgBytes}`}
                                                alt="프로필"
                                                style={{
                                                    width: 128,
                                                    height: 128,
                                                    borderRadius: 16,
                                                    objectFit: "cover",
                                                    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: 128,
                                                    height: 128,
                                                    borderRadius: 2,
                                                    bgcolor: "#eee",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "#bdbdbd",
                                                    fontSize: 32,
                                                    border: "2px dashed #bdbdbd"
                                                }}
                                            >
                                                ?
                                            </Box>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: 20 }}>
                                        {tutor.name}
                                    </TableCell>
                                    <TableCell sx={{ color: "#1976d2", fontWeight: 500, fontSize: 18 }}>
                                        {tutor.tutorMbti}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}

export default TutorPage;