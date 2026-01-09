import api from './api';

const resumeService = {
    // Create a new resume
    createResume: async (resumeData) => {
        const response = await api.post('/resumes', resumeData);
        return response.data;
    },

    // Get all resumes for the user
    getResumes: async () => {
        const response = await api.get('/resumes');
        return response.data;
    },

    // Get a single resume by ID
    getResume: async (id) => {
        const response = await api.get(`/resumes/${id}`);
        return response.data;
    },

    // Update a resume
    updateResume: async (id, resumeData) => {
        const response = await api.put(`/resumes/${id}`, resumeData);
        return response.data;
    },

    // Delete a resume
    deleteResume: async (id) => {
        const response = await api.delete(`/resumes/${id}`);
        return response.data;
    },
};

export default resumeService;
