import React, { useState, useEffect } from "react";
import {
    Box, Typography, Paper, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Snackbar, Alert
} from "@mui/material";

function TutorDetailPage({ tutor, onClose }) {
    const [schedules, setSchedules] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        if (!tutor?.tutorId) return;
        fetch(`http://localhost:55500/tutors/schedule/${tutor.tutorId}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.payload) setSchedules(data.payload);
            })
            .catch(err => {
                console.error("튜터 정보 불러오기 실패:", err);
            });
    }, [tutor]);

    if (!tutor) return null;

    return (
        <Paper sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                {tutor.profileImgBytes ? (
                    <img
                        src={`data:image/png;base64,${tutor.profileImgBytes}`}
                        alt="프로필"
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 12,
                            objectFit: "cover",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            bgcolor: "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#bdbdbd",
                            fontSize: 28,
                            border: "2px dashed #bdbdbd"
                        }}
                    >
                        ?
                    </Box>
                )}
                <Box>
                    <Typography variant="h6" gutterBottom>
                        {tutor.name}
                    </Typography>
                    <Typography>MBTI: {tutor.tutorMbti}</Typography>
                    <Typography>Email: {tutor.email}</Typography>
                    <Typography>Phone: {tutor.phone}</Typography>
                </Box>
                <Button onClick={onClose} sx={{ ml: "auto" }}>닫기</Button>
            </Box>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>예약 현황</Typography>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
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
                                <TableRow key={idx}>
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
        </Paper>
    );
}

export default TutorDetailPage;