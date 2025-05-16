
import React, { createContext, useContext, ReactNode, useCallback } from "react";
import { UserPreferences, DashboardLayout, Widget } from "../types";
import usePersistedState from "../hooks/usePersistedState";
import { preferencesAPI } from "../lib/api";
import { v4 as uuidv4 } from "uuid";

// Default user preferences
export const defaultPreferences: UserPreferences = {
  userId: "current-user", // This would typically come from auth
  theme: "dark",
  selectedSymbols: [],
  defaultLayout: "default",
  layouts: [
    {
      id: "default",
      name: "Default Layout",
      widgets: [
        {
          id: uuidv4(),
          type: "volumeBarChart",
          title: "Volume by Symbol",
          x: 0,
          y: 0,
          w: 6,
          h: 2,
        },
        {
          id: uuidv4(),
          type: "summaryTable",
          title: "Trade Summary",
          x: 0,
          y: 2,
          w: 12,
          h: 2,
        },
        {
          id: uuidv4(),
          type: "vwapLineChart",
          title: "VWAP Analysis",
          x: 6,
          y: 0,
          w: 6,
          h: 2,
        },
      ],
    },
  ],
};

type UserPrefsContextType = {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  selectedLayout: DashboardLayout;
  setSelectedLayout: (layoutId: string) => void;
  createLayout: (name: string, uploadId?: string) => void;
  updateLayout: (layoutId: string, changes: Partial<DashboardLayout>) => void;
  deleteLayout: (layoutId: string) => void;
  addWidget: (layoutId: string, widget: Omit<Widget, "id">) => void;
  updateWidget: (layoutId: string, widgetId: string, changes: Partial<Widget>) => void;
  removeWidget: (layoutId: string, widgetId: string) => void;
  isSyncing: boolean;
};

const UserPrefsContext = createContext<UserPrefsContextType | undefined>(undefined);

export const UserPrefsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Sync function to push preferences to backend
  const syncToBackend = useCallback(async (prefs: UserPreferences) => {
    await preferencesAPI.save(prefs);
  }, []);

  const [preferences, setPreferences, isSyncing] = usePersistedState<UserPreferences>(
    "user_preferences",
    defaultPreferences,
    syncToBackend
  );

  const selectedLayout = preferences.layouts.find(
    (layout) => layout.id === preferences.defaultLayout
  ) || preferences.layouts[0];

  const updatePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    setPreferences((current) => ({ ...current, ...newPrefs }));
  }, [setPreferences]);

  const setSelectedLayout = useCallback((layoutId: string) => {
    setPreferences((current) => ({
      ...current,
      defaultLayout: layoutId,
    }));
  }, [setPreferences]);

  const createLayout = useCallback((name: string, uploadId?: string) => {
    const newLayout: DashboardLayout = {
      id: uuidv4(),
      name,
      uploadId,
      widgets: [],
    };

    setPreferences((current) => ({
      ...current,
      layouts: [...current.layouts, newLayout],
      defaultLayout: newLayout.id,
    }));
  }, [setPreferences]);

  const updateLayout = useCallback((layoutId: string, changes: Partial<DashboardLayout>) => {
    setPreferences((current) => ({
      ...current,
      layouts: current.layouts.map((layout) =>
        layout.id === layoutId ? { ...layout, ...changes } : layout
      ),
    }));
  }, [setPreferences]);

  const deleteLayout = useCallback((layoutId: string) => {
    setPreferences((current) => {
      // Don't delete if it's the only layout
      if (current.layouts.length === 1) {
        return current;
      }

      const newLayouts = current.layouts.filter((layout) => layout.id !== layoutId);
      const newDefaultLayout = 
        current.defaultLayout === layoutId ? newLayouts[0].id : current.defaultLayout;

      return {
        ...current,
        layouts: newLayouts,
        defaultLayout: newDefaultLayout,
      };
    });
  }, [setPreferences]);

  const addWidget = useCallback((layoutId: string, widget: Omit<Widget, "id">) => {
    const newWidget: Widget = {
      ...widget,
      id: uuidv4(),
    };

    setPreferences((current) => ({
      ...current,
      layouts: current.layouts.map((layout) =>
        layout.id === layoutId
          ? { ...layout, widgets: [...layout.widgets, newWidget] }
          : layout
      ),
    }));
  }, [setPreferences]);

  const updateWidget = useCallback((layoutId: string, widgetId: string, changes: Partial<Widget>) => {
    setPreferences((current) => ({
      ...current,
      layouts: current.layouts.map((layout) =>
        layout.id === layoutId
          ? {
              ...layout,
              widgets: layout.widgets.map((widget) =>
                widget.id === widgetId ? { ...widget, ...changes } : widget
              ),
            }
          : layout
      ),
    }));
  }, [setPreferences]);

  const removeWidget = useCallback((layoutId: string, widgetId: string) => {
    setPreferences((current) => ({
      ...current,
      layouts: current.layouts.map((layout) =>
        layout.id === layoutId
          ? {
              ...layout,
              widgets: layout.widgets.filter((widget) => widget.id !== widgetId),
            }
          : layout
      ),
    }));
  }, [setPreferences]);

  return (
    <UserPrefsContext.Provider
      value={{
        preferences,
        updatePreferences,
        selectedLayout,
        setSelectedLayout,
        createLayout,
        updateLayout,
        deleteLayout,
        addWidget,
        updateWidget,
        removeWidget,
        isSyncing,
      }}
    >
      {children}
    </UserPrefsContext.Provider>
  );
};

export const useUserPrefs = (): UserPrefsContextType => {
  const context = useContext(UserPrefsContext);
  if (!context) {
    throw new Error("useUserPrefs must be used within a UserPrefsProvider");
  }
  return context;
};
