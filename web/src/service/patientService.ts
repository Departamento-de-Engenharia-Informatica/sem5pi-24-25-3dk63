import axios from 'axios';

const API_URL = 'https://localhost:5001/api/patients';

interface SearchPatientsQuery {
    name?: string;
    email?: string;
    dateOfBirth?: string;
    medicalRecordNumber?: string;
}

export const searchPatients = async (query: SearchPatientsQuery): Promise<any[]> => {
    const response = await axios.get(`${API_URL}/search`, { params: query });
    return response.data;
};

export const getPatientById = async (id: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const registerPatient = async (dto: any): Promise<any> => {
    const response = await axios.post(`${API_URL}/register-patient`, dto);
    return response.data;
};

export const updatePatientProfile = async (id: string, updateDto: any): Promise<any> => {
    const response = await axios.patch(`${API_URL}/${id}`, updateDto);
    return response.data;
};

export const deletePatientProfile = async (id: string): Promise<any> => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const getAllPatients = async (): Promise<any[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};