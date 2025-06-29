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
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2}}>
                <BackButton />
                <LogoutButton />
            </Box>
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    📘 튜터 목록
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>이름</TableCell>
                                <TableCell>MBTI</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tutors.map((tutor, idx) => (
                                <TableRow
                                    key={idx}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/tutorDetail/${tutor.tutorId}`)}
                                >
                                    <TableCell>{tutor.name}</TableCell>
                                    <TableCell>{tutor.tutorMbti}</TableCell>
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