// services/staffService.ts
import axios from 'axios';

const API_URL = 'https://localhost:5001/api/staff'; 

interface SearchStaffQuery {
    name?: string;
    email?: string;
    specialization?: string;
}

export const searchStaff = async (query: SearchStaffQuery): Promise<any[]> => {
    const response = await axios.get(`${API_URL}/search`, { params: query });
    return response.data;
};

export const getAllStaff = async (): Promise<any[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getStaffByLicenseNumber = async (licenseNumber: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/${licenseNumber}`);
    return response.data;
};

export const createStaff = async (staffDto: any): Promise<any> => {
    const response = await axios.post(API_URL, staffDto);
    return response.data;
};

export const updateStaffProfile = async (licenseNumber: string, updateDto: any): Promise<any> => {
    const response = await axios.patch(`${API_URL}/update/${licenseNumber}`, updateDto);
    return response.data;
};

export const deleteStaff = async (licenseNumber: string): Promise<any> => {
    const response = await axios.delete(`${API_URL}/${licenseNumber}`);
    return response.data;
};
