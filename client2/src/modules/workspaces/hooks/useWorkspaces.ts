
import { useState, useEffect } from "react";
import { workspaceService } from "../services/workspaceService";
import { Workspace } from "../../../types";
import { WorkspaceFormInput } from "../types/workspace.types";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] =
    useState<Workspace | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all workspaces
  const fetchWorkspaces = async () => {
    setLoading(true);

    try {
      const data = await workspaceService.getWorkspaces();

      const safeWorkspaces = Array.isArray(data) ? data : [];

      setWorkspaces(safeWorkspaces);
      setError(null);

      // Automatically select first workspace
      if (safeWorkspaces.length > 0) {
        setCurrentWorkspace((previous) => {
          if (previous) {
            const stillExists = safeWorkspaces.find(
              (workspace) => workspace.id === previous.id
            );

            if (stillExists) {
              return stillExists;
            }
          }

          return safeWorkspaces[0];
        });
      } else {
        setCurrentWorkspace(null);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load workspaces");
      setWorkspaces([]);
      setCurrentWorkspace(null);
    } finally {
      setLoading(false);
    }
  };

  // Select workspace
  const selectWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  // Create workspace
  const createWorkspace = async (
    input: WorkspaceFormInput
  ): Promise<Workspace | null> => {
    try {
      const created = await workspaceService.createWorkspace(input);

      setWorkspaces((prev) => [...prev, created]);

      // Make newly created workspace active
      setCurrentWorkspace(created);

      setError(null);

      return created;
    } catch (err: any) {
      setError(err?.message || "Failed to create workspace");
      return null;
    }
  };

  // Alias so existing Container code can use addWorkspace
  const addWorkspace = createWorkspace;

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return {
    workspaces,
    currentWorkspace,
    loading,
    error,

    // Workspace selection
    selectWorkspace,

    // Workspace creation
    createWorkspace,
    addWorkspace,

    // Refresh
    refresh: fetchWorkspaces,
  };
}

