
import { ReactNode } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { Widget } from "@/types";
import { useUserPrefs } from "@/contexts/UserPrefsContext";

// Import the CSS files with correct paths
import "react-grid-layout/css/styles.css";
// We need to handle the react-resizable CSS differently since it's causing an issue
// Using a relative path that's compatible with how the package is distributed
import "../../../node_modules/react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridLayoutProps {
  layoutId: string;
  widgets: Widget[];
  children: ReactNode[];
  onLayoutChange?: (layout: Layout[]) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export default function GridLayout({
  layoutId,
  widgets,
  children,
  onLayoutChange,
  isDraggable = true,
  isResizable = true,
}: GridLayoutProps) {
  const { updateWidget } = useUserPrefs();

  // Convert widgets to react-grid-layout format
  const layout = widgets.map(({ id, x, y, w, h }) => ({
    i: id,
    x,
    y,
    w,
    h,
    minW: 3,
    minH: 2,
  }));

  // Handle layout changes
  const handleLayoutChange = (currentLayout: Layout[]) => {
    // Update widget positions in context
    currentLayout.forEach((item) => {
      const widget = widgets.find((w) => w.id === item.i);
      if (widget) {
        updateWidget(layoutId, item.i, {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        });
      }
    });

    // Call the optional callback
    if (onLayoutChange) {
      onLayoutChange(currentLayout);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <ResponsiveGridLayout
        className="dashboard-grid"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        margin={[16, 16]}
        isDraggable={isDraggable}
        isResizable={isResizable}
        onLayoutChange={(currentLayout) => handleLayoutChange(currentLayout)}
        draggableHandle=".widget-drag-handle"
      >
        {layout.map((item, index) => (
          <div key={item.i} className="rounded-lg border">
            {children[index]}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
