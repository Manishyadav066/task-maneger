import { FileItem } from '../../../types';

export type { FileItem };

export interface UploadFileInput {
  name: string;
  size: string;
  type: string;
  projectId?: string;
}
