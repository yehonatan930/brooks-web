import React, { useState } from 'react';
import { Button } from '@mui/material';

interface PaginationControlsProps {
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ totalPages, onPageChange }) => {
  const [page, setPage] = useState(1);

  const handleNextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      onPageChange(newPage);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      onPageChange(newPage);
    }
  };

  return (
    <div className="pagination-controls">
      <Button onClick={handlePreviousPage} disabled={page === 1}>
        Previous
      </Button>
      <span>Page {page} of {totalPages}</span>
      <Button onClick={handleNextPage} disabled={page === totalPages}>
        Next
      </Button>
    </div>
  );
};

export default PaginationControls;