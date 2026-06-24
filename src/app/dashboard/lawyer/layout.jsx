import { requireRole } from '@/lib/core/session';
import React from 'react';

const LawyerLayout = async ({ children }) => {
    await requireRole('recruiter')
    return children;
};

export default LawyerLayout;