import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    MenuItem,
} from "@mui/material";
import axios from "axios";
import InsertSubjects from "./InsertSubjects";
import ViewStudent from "./ViewStudent";
const host = process.env.REACT_APP_HOST;

export default function InsertStudent() {
    const [formData, setFormData] = useState({
        rollNo: "",
        studentName: "",
        subject: "",
        studentGrade: "",
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [subjects, setSubjects] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // Clear error for the field
    };

    useEffect(() => {
        axios
            .get(`${host}/api/subject/getSubject`)
            .then((response) => {
                setSubjects(response.data); // Assuming response.data is an array of subject objects
            })
            .catch((error) => {
                console.error("Error fetching subjects:", error);
            });
    }, [submitted,tabValue]);

    const validateForm = () => {
        const newErrors = {};
    
        // Validate Roll No
        // if (!formData.rollNo.trim()) {
        //     newErrors.rollNo = "Roll No is required.";
        // } else if (!/^\d+$/.test(formData.rollNo.trim())) {
        //     newErrors.rollNo = "Roll No must be a number.";
        // }
    
        // Validate Student Name
        if (!formData.studentName.trim()) {
            newErrors.studentName = "Student Name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.studentName.trim())) {
            newErrors.studentName = "Student Name must contain only letters and spaces.";
        }
    
        // Validate Subject
        if (!formData.subject) {
            newErrors.subject = "Subject is required.";
        }
    
        // Validate Marks
        if (!formData.studentGrade.trim()) {
            newErrors.studentGrade = "Marks are required.";
        } else if (!/^\d+$/.test(formData.studentGrade.trim())) {
            newErrors.studentGrade = "Marks must be a number.";
        } else if (parseInt(formData.studentGrade, 10) < 0 || parseInt(formData.studentGrade, 10) > 100) {
            newErrors.studentGrade = "Marks must be between 0 and 100.";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Stop submission if validation fails

        axios
            .post(`${host}/api/student/studentInsert`, formData)
            .then((res) => {
                console.log(res);
                setFormData({
                    // rollNo: "",
                    studentName: "",
                    subject: "",
                    studentGrade: "",
                });
                setSubmitted(true);

                setTimeout(() => {
                    setSubmitted(false);
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div>
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                    padding: 2,
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        padding: 4,
                        maxWidth: 600,
                        width: "100%",
                        borderRadius: 4,
                        backgroundColor: "#fff",
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="student form tabs"
                        centered
                    >
                        <Tab label="Subjects" />
                        <Tab label="Add Student Grade" />
                        <Tab label="View Student Grade" />
                    </Tabs>

                    {tabValue === 0 && <InsertSubjects />}
                    {tabValue === 1 && (
                        <Box sx={{ marginTop: 3 }}>
                            <Typography
                                variant="h6"
                                textAlign="center"
                                mb={3}
                                sx={{ fontWeight: "bold", color: "#333" }}
                            >
                                Insert Student Details
                            </Typography>
                            <Box>
                                {/* <TextField
                                    label="Roll No"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleChange}
                                    error={!!errors.rollNo}
                                    helperText={errors.rollNo}
                                    sx={{ marginBottom: 3 }}
                                /> */}
                                <TextField
                                    label="Student Name"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="studentName"
                                    value={formData.studentName}
                                    onChange={handleChange}
                                    error={!!errors.studentName}
                                    helperText={errors.studentName}
                                    sx={{ marginBottom: 3 }}
                                />
                                <TextField
                                    select
                                    label="Subject"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    error={!!errors.subject}
                                    helperText={errors.subject}
                                    sx={{ marginBottom: 3 }}
                                >
                                    {subjects.map((subject, index) => (
                                        <MenuItem key={index} value={subject._id}>
                                            {subject.subject_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Marks"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="studentGrade"
                                    value={formData.studentGrade}
                                    onChange={handleChange}
                                    error={!!errors.studentGrade}
                                    helperText={errors.studentGrade}
                                    sx={{ marginBottom: 3 }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    onClick={handleSubmit}
                                    sx={{
                                        padding: 1,
                                        background: "linear-gradient(90deg, #ff8a00, #e52e71)",
                                        fontWeight: "bold",
                                        letterSpacing: 1,
                                        "&:hover": {
                                            background: "linear-gradient(90deg, #e52e71, #ff8a00)",
                                            transform: "scale(1.02)",
                                        },
                                        transition: "all 0.3s ease-in-out",
                                    }}
                                >
                                    Submit
                                </Button>
                            </Box>
                            {submitted && (
                                <Typography
                                    variant="body1"
                                    textAlign="center"
                                    color="green"
                                    sx={{ marginTop: 3 }}
                                >
                                    Details submitted successfully!
                                </Typography>
                            )}
                        </Box>
                    )}
                    {tabValue === 2 && <ViewStudent />}

                </Paper>
            </Box>
        </div>
    );
}
