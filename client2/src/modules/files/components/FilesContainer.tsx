import React from 'react';
import { useFiles } from '../hooks/useFiles';
import { FilesUI } from '../ui/FilesUI';

interface FilesContainerProps {
  projectId?: string;
}

export const FilesContainer: React.FC<FilesContainerProps> = ({ projectId }) => {
  const { files, loading, uploadFile, deleteFile } = useFiles(projectId);

  return <FilesUI files={files} loading={loading} onUpload={uploadFile} onDelete={deleteFile} />;
};
