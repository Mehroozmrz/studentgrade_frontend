import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TextField, Select, MenuItem, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import axios from 'axios';
const host = process.env.REACT_APP_HOST;

export default function ViewStudent() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [remarkFilter, setRemarkFilter] = useState('');
    const [deletedStudent, setDeleteStudent] = useState(false);

    useEffect(() => {
        axios
            .get(`${host}/api/student/getStudent`)
            .then((response) => {
                console.log(response.data);
                setStudents(response.data);
                setFilteredStudents(response.data); // Initialize filteredStudents
            })
            .catch((error) => {
                console.error("Error fetching subjects:", error);
            });
    }, [deletedStudent]);

    useEffect(() => {
        let updatedStudents = students;

        if (searchQuery) {
            updatedStudents = updatedStudents.filter((student) =>
                student?.student_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (remarkFilter) {
            updatedStudents = updatedStudents.filter((student) => student?.remark === remarkFilter);
        }

        setFilteredStudents(updatedStudents);
    }, [searchQuery, remarkFilter, students]);

    
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this Student?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${host}/api/student/deleteStudent/${id}`)
                    .then((response) => {
                        setDeleteStudent(!deletedStudent);
                    })
                    .catch((err) => {
                        console.log("Error : " + err);
                    })
                Swal.fire('Deleted!', 'Student has been deleted.', 'success');
            }
        });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Student List</h2>

            {/* Search and Filter Controls */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                <TextField
                    label="Search by Name"
                    variant="outlined"
                    size='small'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '300px' }}
                />
                <Select
                    value={remarkFilter}
                    size='small'

                    onChange={(e) => setRemarkFilter(e.target.value)}
                    displayEmpty
                    style={{ width: '150px' }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="PASS">Pass</MenuItem>
                    <MenuItem value="FAIL">Fail</MenuItem>
                </Select>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Remark</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align='center'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ color: 'red' }}>
                                    No data found!
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student?._id}>
                                    <TableCell>{student?.student_name}</TableCell>
                                    <TableCell>{student?.subject_key?.subject_name}</TableCell>
                                    <TableCell>{student?.grade}</TableCell>
                                    <TableCell>
                                        {student?.remark === "PASS" ? (
                                            <Chip label="PASS" color="success" />
                                        ) : (
                                            <Chip label="FAIL" color="error" />
                                        )}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {/* <IconButton ><EditIcon /></IconButton> */}
                                        <IconButton onClick={() => { handleDelete(student?._id) }}><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
