import React, { useContext, useState, useEffect } from 'react';
import {
    Container, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Switch, Pagination, FormControl, FormControlLabel, InputLabel, Select, MenuItem
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import moment from 'moment';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx'
import { Chip } from '@mui/material';
import Swal from 'sweetalert2'



const LiveStream = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole } = useContext(MainContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [Newloading, setNewLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editStream, setEditStream] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [allPermission, setAllPermission] = useState([])
    const permissionPerPage = 10;
    const [formData, setFormData] = useState({
        title: '',
        embedUrl: '',
        scheduleFrom: '',
        scheduleTo: '',
        isLive: false,
        description: ''
    });

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const adminToken = getCookie("adminToken");

    if (adminRole?.toLowerCase() !== "admin") {
        return (
            <AccessDenied />
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchStreams();
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const totalPages = Math.ceil(allPermission.length / permissionPerPage);
    const indexOfLastPermission = currentPage * permissionPerPage;
    const indexOfFirstPermission = indexOfLastPermission - permissionPerPage;
    const visiblePermission = allPermission.slice(indexOfFirstPermission, indexOfLastPermission);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };


    const handleAddStream = async () => {
        const { title, description, embedUrl, scheduleFrom, scheduleTo, isLive } = formData;

        if (!title || !scheduleFrom || !scheduleTo) {
            return Swal.fire({
                title: 'Error!',
                text: 'Title, Schedule From and Schedule To are required!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

        setNewLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/livestream/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    embedUrl,
                    scheduleFrom,
                    scheduleTo,
                    isLive
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error adding livestream");

            Swal.fire({
                title: 'Success!',
                text: 'Livestream added successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setOpenModal(false);
            setFormData({
                title: '',
                description: '',
                embedUrl: '',
                scheduleFrom: '',
                scheduleTo: '',
                isLive: false,
            });
            fetchStreams();
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setNewLoading(false);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this stream?")) return;

        try {
            const response = await fetch(`${BASE_URL}/livestream/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },

            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Error deleting Role");

            Swal.fire({
                title: 'Deleted!',
                text: 'Stream deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            fetchStreams();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };


    const handleEdit = (item) => {
        setEditStream(item);
        setOpenEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editStream?.title || !editStream?.startTime || !editStream?.endTime) {
            return Swal.fire({
                title: 'Error!',
                text: 'Title, Schedule From, or Schedule To is missing.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

        setNewLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/livestream/${editStream._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: editStream.title,
                    description: editStream.description,
                    streamUrl: editStream.streamUrl,
                    startTime: editStream.startTime,
                    endTime: editStream.endTime,
                    isLive: editStream.isLive
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error updating stream");

            Swal.fire({
                title: 'Success!',
                text: 'Stream updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setOpenEditModal(false);
            setEditStream(null);
            fetchStreams();
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setNewLoading(false);
        }
    };



    const fetchStreams = async () => {

        try {
            const response = await fetch(`${BASE_URL}/livestream/get-all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error fetching stream");
            }
            setAllPermission(data || []);
        }
        catch (error) {
            alert(`Error : ${error.message}`);
        }

    }

    function toDatetimeLocal(date) {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // adjust to local time
        return d.toISOString().slice(0, 16); // get yyyy-MM-ddThh:mm
    }

    const handleStatusToggle = async (streamId, newStatus) => {
        try {
            const response = await fetch(`${BASE_URL}/livestream/${streamId}/status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isLive: newStatus }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Failed to update status');


            fetchStreams();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };



    return (
        <Container>
            <Box display="flex" justifyContent="space-between" my={4}>
                <Button variant="contained" color="error" onClick={() => navigate('/admin/dashboard')}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                    Add Stream
                </Button>
            </Box>


            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : allPermission.length === 0 ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <p>No stream found</p>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }} sx={{
                                    "@media (min-width: 1024px)": {
                                        pl: 5
                                    }
                                }} align="left">No</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"
                                    sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 10
                                        }
                                    }}
                                >
                                    title
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"
                                    sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 10
                                        }
                                    }}
                                >
                                    URL
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"
                                    sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 10
                                        }
                                    }}
                                >
                                    Start
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"
                                    sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 10
                                        }
                                    }}
                                >
                                    End
                                </TableCell>

                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"
                                    sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 10
                                        }
                                    }}
                                >
                                    isLive
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }} align="right" sx={{ pr: 18 }}>Actions</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visiblePermission.map((admin, index) => (

                                <TableRow key={admin._id}>
                                    <TableCell sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 5
                                        }
                                    }} align="left">
                                        {indexOfFirstPermission + index + 1}
                                    </TableCell>

                                    <TableCell align="center" sx={{ "@media (min-width: 1024px)": { pl: 10 } }}>
                                        {admin.title?.split(" ").slice(0, 4).join(" ")}...
                                    </TableCell>

                                    <TableCell align="center" sx={{ "@media (min-width: 1024px)": { pl: 10 } }}>
                                        <button
                                            style={{ padding: "6px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                            onClick={() => window.open(admin.embedUrl.match(/src="([^"]+)"/)?.[1], "_blank")}
                                        >
                                            View
                                        </button>
                                    </TableCell>

                                    <TableCell align="center" sx={{ "@media (min-width: 1024px)": { pl: 10 } }}>
                                        {moment(admin.startTime).format("DD MMM YYYY, h:mm A")}
                                    </TableCell>

                                    <TableCell align="center" sx={{ "@media (min-width: 1024px)": { pl: 10 } }}>
                                        {moment(admin.endTime).format("DD MMM YYYY, h:mm A")}
                                    </TableCell>
                                    <TableCell align="center" sx={{ "@media (min-width: 1024px)": { pl: 10 } }}>
                                        <Switch
                                            checked={admin.isLive}
                                            color="success"
                                            onChange={(e) => handleStatusToggle(admin._id, e.target.checked)}
                                        />
                                    </TableCell>


                                    <TableCell sx={{ pr: 12 }} align="right">
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            

                                            <Button

                                                onClick={() => handleDelete(admin._id)}
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                sx={{
                                                    border: "2px solid",
                                                    borderRadius: '8px',
                                                    minWidth: '70px'
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
            }

            {/* Add Modal */}
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        width: "500px",
                        borderRadius: 3,
                        padding: 2,
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
                    Add New Stream
                </DialogTitle>

                <DialogContent>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{ display: 'grid', gap: 2, mt: 1 }}
                    >
                        <TextField
                            name="title"
                            label="Title"
                            fullWidth
                            variant="outlined"
                            value={formData.title}
                            onChange={handleChange}
                        />

                        <TextField
                            name="embedUrl"
                            label="Embed URL"
                            fullWidth
                            variant="outlined"
                            value={formData.embedUrl}
                            onChange={handleChange}
                        />

                        <TextField
                            name="scheduleFrom"
                            label="Start Time"
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.scheduleFrom}
                            onChange={handleChange}
                        />

                        <TextField
                            name="scheduleTo"
                            label="End Time"
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.scheduleTo}
                            onChange={handleChange}
                        />

                        <TextField
                            name="description"
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    name="isLive"
                                    checked={formData.isLive}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, isLive: e.target.checked }))
                                    }
                                    color="success"
                                />
                            }
                            label="Is Live"
                        />

                    </Box>
                </DialogContent>


                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <Button onClick={() => setOpenModal(false)} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleAddStream} color="primary" variant="contained">
                        {Newloading ? <CircularProgress size={24} color="inherit" /> : 'Add'}

                    </Button>
                </DialogActions>
            </Dialog>



         




            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

        </Container >
    );
};

export default LiveStream;
