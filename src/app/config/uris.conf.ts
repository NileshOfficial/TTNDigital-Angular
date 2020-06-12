const serverRootUri = 'http://localhost:3001/';

export const loginRequestEndpoint = serverRootUri + 'auth/login';
export const refreshTokenEndpoint = serverRootUri + 'auth/refreshAuthToken';
export const logoutEndpoint = serverRootUri + 'auth/logout';
export const adminCheckEndpoint = serverRootUri + 'admin/isAdmin';
export const buzzPostEndpoint = serverRootUri + 'buzz';
export const updateLikeEndpoint = serverRootUri + 'buzz/like';
export const updateDislikeEndpoint = serverRootUri + 'buzz/dislike';
export const imagesEndpoint = serverRootUri + 'images';
export const addComplaintEndpoint = serverRootUri + 'complaints';
export const getAllComplaintsEndpoint = serverRootUri + 'complaints/all';
export const validateTokenEndpoint = serverRootUri + 'auth/validate';