'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of wholesale fabric sales, buyer inquiry velocity, and daily loom dispatch metrics."
      />
    </div>
  );
}
