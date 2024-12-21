import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface Company {
    id: number;
    name: string;
    progress: string;
}

export default function CompaniesList() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false); // Loading state

    const rowsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Show spinner
            try {
                const response = await fetch(`http://127.0.0.1:3000/companies?page=${currentPage}&limit=${rowsPerPage}`);
                const data = await response.json();
                setCompanies(data.companies || []);
                setTotalPages(data.totalPages || 1);
            } catch (error) {
                console.error("Failed to fetch companies:", error);
            } finally {
                setLoading(false); // Hide spinner
            }
        };
        fetchData();
    }, [currentPage]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number): void => {
        setCurrentPage(value);
    };

    const handleProgressChange = (id: number, newValue: string): void => {
        setCompanies((prevCompanies: Company[]) =>
            prevCompanies.map((company) =>
                company.id === id ? { ...company, progress: newValue } : company
            )
        );
    };

    return (
        <div>
            {loading ? (
                // Show spinner while loading
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Company Name</TableCell>
                                    <TableCell>Progress</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {companies.map(({ id, name, progress }: Company) => (
                                    <TableRow key={id}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={progress || ''}
                                                onChange={(e) => handleProgressChange(id, e.target.value)}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Progress
                                                </MenuItem>
                                                <MenuItem value="Not Started">Not Started</MenuItem>
                                                <MenuItem value="In Progress">In Progress</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
            <Stack spacing={2} sx={{ marginTop: 2 }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Stack>
        </div>
    );
}