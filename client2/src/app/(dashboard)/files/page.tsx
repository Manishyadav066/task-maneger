import React from 'react';
import { FilesContainer } from '../../../modules/files/components/FilesContainer';

interface FilesPageProps {
  projectId?: string;
}

export const FilesPage: React.FC<FilesPageProps> = ({ projectId }) => {
  return <FilesContainer projectId={projectId} />;
};

export default FilesPage;
