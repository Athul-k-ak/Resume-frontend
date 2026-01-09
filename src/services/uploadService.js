import api from './api';

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file); // 👈 MUST be "image"

  const res = await api.post('/upload/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data.imageUrl;
};
