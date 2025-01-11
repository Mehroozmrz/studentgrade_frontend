import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import ViewSubjects from "./ViewSubjects";

const host = process.env.REACT_APP_HOST;

export default function InsertSubjects() {
    const [subjectName, setSubjectName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(""); 

    const handleChange = (e) => {
        setSubjectName(e.target.value); 
        setError(""); 
    };

    const handleSubmit = (e) => {
        // Prevent form submission if subject name is empty
        if (!subjectName.trim()) {
            setError("Subject Name is required");
            return;
        }

        axios.post(`${host}/api/subject/subjectInsert`, { subjectName })
            .then((res) => {
                console.log(res);
                setSubjectName(""); // Clear subject name after submission
                setSubmitted(true);

                setTimeout(() => {
                    setSubmitted(false);
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
            });

        console.log(subjectName);
    };

    return (
        <div>
            <Box sx={{ marginTop: 3 }}>
                <Typography
                    variant="h6"
                    textAlign="center"
                    mb={3}
                    sx={{ fontWeight: "bold", color: "#333" }}
                >
                    Insert Subjects
                </Typography>
                <Box>
                    <TextField
                        label="Subject Name"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={subjectName}
                        onChange={handleChange}
                        error={!!error} // Show error if there is one
                        helperText={error} // Display error message
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
                            size: "small",
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
            <Box>
                <ViewSubjects submitted={submitted} />
            </Box>
        </div>
    );
}
