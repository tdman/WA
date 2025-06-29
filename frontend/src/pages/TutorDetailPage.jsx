import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Box, Typography, Paper, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Snackbar, Alert
} from "@mui/material";
import BackButton from "../components/BackButton";
import LogoutButton from "../components/LogoutButton";

function TutorDetailPage() {
    const { tutorId } = useParams();
    const [schedules, setSchedules] = useState([]);
    const [tutorInfo, setTutorInfo] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:55500/tutors/schedule/${tutorId}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.payload && data.payload.length > 0) {
                    setSchedules(data.payload);
                    setTutorInfo({
                        name: data.payload[0].name,
                        mbti: data.payload[0].tutorMbti,
                        email: data.payload[0].email,
                        phone: data.payload[0].phone
                    });
                }
            })
            .catch(err => {
                console.error("튜터 정보 불러오기 실패:", err);
            });
    }, [tutorId]);

    const handleRowClick = (isReservable) => {
        if (isReservable) {
            setOpenSnackbar(true);
        }
    };

    if (!tutorInfo) {
        return (
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <Typography>로딩 중...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <BackButton />
                <LogoutButton />
            </Box>
            <Paper sx={{ p: 4, mt: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    📝 튜터 상세 정보
                </Typography>
                <Typography><b>이름:</b> {tutorInfo.name}</Typography>
                <Typography><b>MBTI:</b> {tutorInfo.mbti}</Typography>
                <Typography><b>Email:</b> {tutorInfo.email}</Typography>
                <Typography><b>Phone:</b> {tutorInfo.phone}</Typography>
            </Paper>
            <Typography variant="h6" gutterBottom>
                예약 현황
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>날짜</TableCell>
                            <TableCell>시간</TableCell>
                            <TableCell>예약 상태</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedules.map((schedule, idx) => {
                            const isReservable = !(schedule.studentId && schedule.scheduleHour);
                            return (
                                <TableRow
                                    key={idx}
                                    hover={isReservable}
                                    sx={isReservable ? { cursor: "pointer", "&:hover": { backgroundColor: "#fffde7" } } : {}}
                                    onClick={() => handleRowClick(isReservable)}
                                >
                                    <TableCell>{schedule.scheduleDate}</TableCell>
                                    <TableCell>
                                        {schedule.scheduleHour ? `${schedule.scheduleHour}시` : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {schedule.studentId && schedule.scheduleHour ? (
                                            <Chip label="예약됨" color="error" />
                                        ) : (
                                            <Chip label="예약 가능" color="success" />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() => navigate(-1)}
            >
               튜터 목록으로
            </Button>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    상담 문자가 발송되었습니다!
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default TutorDetailPage;