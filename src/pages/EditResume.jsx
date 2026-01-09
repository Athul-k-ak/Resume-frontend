import React from 'react';
import { useParams } from 'react-router-dom';
import CreateResume from './CreateResume';

const EditResume = () => {
    const { id } = useParams();

    // In a real app, you would fetch the resume data by ID here
    // For now, we'll just reuse the CreateResume component

    return <CreateResume isEditing={true} resumeId={id} />;
};

export default EditResume;
