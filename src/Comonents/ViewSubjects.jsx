import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const host = process.env.REACT_APP_HOST;

export default function ViewSubjects({ submitted }) {
    const [subjects, setSubjects] = useState([]);
    const [editSubject, setEditSubject] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [deletedSubject, setDeleteSubject] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        axios
            .get(`${host}/api/subject/getSubject`)  
            .then((response) => {
                setSubjects(response.data);
            })
            .catch((error) => {
                console.error("Error fetching subjects:", error);
            });
    }, [submitted, openEditDialog, deletedSubject]);

    // Handle the edit button click
    const handleEditClick = (subject) => {
        setEditSubject(subject);
        setOpenEditDialog(true);
        setError(""); // Reset error when opening edit dialog
    };

    // Handle the edit form submit
    const handleEditSubmit = () => {
        if (!editSubject.subject_name.trim()) {
            setError("Subject Name is required");
            return;
        }

        axios
            .put(`${host}/api/subject/updateSubject/${editSubject._id}`, editSubject)
            .then((response) => {
                setOpenEditDialog(false);
                setError(""); 
            })
            .catch((error) => {
                console.error("Error updating subject:", error);
            });
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this Subject',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${host}/api/subject/deleteSubject/${id}`)
                    .then((response) => {
                        setDeleteSubject(!deletedSubject);
                    })
                    .catch((err) => {
                        console.log("Error : " + err);
                    })
                Swal.fire('Deleted!', 'Subject has been deleted.', 'success');
            }
        });
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
                    View Subjects
                </Typography>
                <Box>
                    <Paper sx={{ overflow: "hidden" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Subject Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subjects?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">
                                            No Subjects Available
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subjects?.map((subject) => (
                                        <TableRow key={subject?.id}>
                                            <TableCell>{subject?.subject_name}</TableCell>
                                            <TableCell align="center">
                                                <IconButton onClick={() => handleEditClick(subject)}><EditIcon /></IconButton>
                                                <IconButton onClick={() => { handleDelete(subject._id) }}><DeleteIcon /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

                        </Table>
                    </Paper>
                </Box>
            </Box>

            {/* Edit Subject Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Subject</DialogTitle>
                <DialogContent >
                    <TextField
                    sx={{mt:2}}
                        label="Subject Name"
                        value={editSubject?.subject_name || ""}
                        onChange={(e) => setEditSubject({ ...editSubject, subject_name: e.target.value })}
                        fullWidth
                        error={!!error} 
                        helperText={error} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleEditSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
