import type { ReactElement, SVGProps } from "react";

type SvgIconProps = Omit<
  SVGProps<SVGSVGElement>,
  "children" | "d" | "stroke"
> & {
  size?: number;
  stroke?: number;
  fill?: string;
};

interface IconProps extends SvgIconProps {
  d: ReactElement;
}

// Minimal Lucide-style icons, stroke-based
const Icon = ({ d, size = 18, stroke = 2, fill, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill || "none"}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {d}
  </svg>
);

export const Icons: Record<string, (props: SvgIconProps) => ReactElement> = {
  Package: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M16.5 9.4 7.5 4.21" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </>
      }
    />
  ),
  Home: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </>
      }
    />
  ),
  Route: (p) => (
    <Icon
      {...p}
      d={
        <>
          <circle cx="6" cy="19" r="3" />
          <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
          <circle cx="18" cy="5" r="3" />
        </>
      }
    />
  ),
  History: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l4 2" />
        </>
      }
    />
  ),
  Settings: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.09a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </>
      }
    />
  ),
  Mail: (p) => (
    <Icon
      {...p}
      d={
        <>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </>
      }
    />
  ),
  Lock: (p) => (
    <Icon
      {...p}
      d={
        <>
          <rect width="18" height="11" x="3" y="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>
      }
    />
  ),
  Eye: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      }
    />
  ),
  EyeOff: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" x2="22" y1="2" y2="22" />
        </>
      }
    />
  ),
  Shield: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </>
      }
    />
  ),
  Search: (p) => (
    <Icon
      {...p}
      d={
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </>
      }
    />
  ),
  Bell: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </>
      }
    />
  ),
  ChevronDown: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="m6 9 6 6 6-6" />
        </>
      }
    />
  ),
  ChevronRight: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="m9 18 6-6-6-6" />
        </>
      }
    />
  ),
  ChevronLeft: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="m15 18-6-6 6-6" />
        </>
      }
    />
  ),
  Check: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M20 6 9 17l-5-5" />
        </>
      }
    />
  ),
  X: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      }
    />
  ),
  Plus: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </>
      }
    />
  ),
  Copy: (p) => (
    <Icon
      {...p}
      d={
        <>
          <rect width="14" height="14" x="8" y="8" rx="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </>
      }
    />
  ),
  MapPin: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </>
      }
    />
  ),
  Navigation: (p) => (
    <Icon
      {...p}
      d={
        <>
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </>
      }
    />
  ),
  NavigationDepart: (p) => (
    <Icon
      {...p}
      d={
        <>
          <rect width="10" height="18" x="7" y="3" rx="5" />
          <circle cx="12" cy="8" r="1.25" fill="currentColor" />
          <circle cx="12" cy="13" r="1.25" />
          <circle cx="12" cy="18" r="1.25" />
        </>
      }
    />
  ),
  NavigationArrive: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M5 21V4" />
          <path d="M5 4h11l-2 4 2 4H5" />
          <path d="M19 21H3" />
        </>
      }
    />
  ),
  NavigationTurn: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M7 7h5a5 5 0 0 1 5 5v8" />
          <path d="m7 7 5-5" />
          <path d="M7 7l5 5" />
        </>
      }
    />
  ),
  NavigationRoundabout: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M7.5 7.5A6.5 6.5 0 0 1 18 12.5" />
          <path d="M16 10.5h2.5V8" />
          <path d="M16.5 16.5A6.5 6.5 0 0 1 6 11.5" />
          <path d="M8 13.5H5.5V16" />
          <circle cx="12" cy="12" r="2" />
        </>
      }
    />
  ),
  NavigationStraight: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M12 21V3" />
          <path d="m6 9 6-6 6 6" />
        </>
      }
    />
  ),
  Clock: (p) => (
    <Icon
      {...p}
      d={
        <>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </>
      }
    />
  ),
  TrendingUp: (p) => (
    <Icon
      {...p}
      d={
        <>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </>
      }
    />
  ),
  AlertCircle: (p) => (
    <Icon
      {...p}
      d={
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </>
      }
    />
  ),
  AlertTriangle: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </>
      }
    />
  ),
  Info: (p) => (
    <Icon
      {...p}
      d={
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </>
      }
    />
  ),
  Truck: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
        </>
      }
    />
  ),
  LogOut: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </>
      }
    />
  ),
  Menu: (p) => (
    <Icon
      {...p}
      d={
        <>
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </>
      }
    />
  ),
  PanelLeft: (p) => (
    <Icon
      {...p}
      d={
        <>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
        </>
      }
    />
  ),
  Maximize: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </>
      }
    />
  ),
  Plus2: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </>
      }
    />
  ),
  Wifi: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <path d="M12 20h.01" />
        </>
      }
    />
  ),
  WifiOff: (p) => (
    <Icon
      {...p}
      d={
        <>
          <line x1="2" x2="22" y1="2" y2="22" />
          <path d="M8.5 16.429a5 5 0 0 1 7 0" />
          <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
          <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
          <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
          <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
          <path d="M12 20h.01" />
        </>
      }
    />
  ),
  User: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      }
    />
  ),
  Users: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      }
    />
  ),
  Globe: (p) => (
    <Icon
      {...p}
      d={
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </>
      }
    />
  ),
  Moon: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </>
      }
    />
  ),
  Sun: (p) => (
    <Icon
      {...p}
      d={
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </>
      }
    />
  ),
  Grid: (p) => (
    <Icon
      {...p}
      d={
        <>
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </>
      }
    />
  ),
  List: (p) => (
    <Icon
      {...p}
      d={
        <>
          <line x1="8" x2="21" y1="6" y2="6" />
          <line x1="8" x2="21" y1="12" y2="12" />
          <line x1="8" x2="21" y1="18" y2="18" />
          <line x1="3" x2="3.01" y1="6" y2="6" />
          <line x1="3" x2="3.01" y1="12" y2="12" />
          <line x1="3" x2="3.01" y1="18" y2="18" />
        </>
      }
    />
  ),
  Calendar: (p) => (
    <Icon
      {...p}
      d={
        <>
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
        </>
      }
    />
  ),
  Filter: (p) => (
    <Icon
      {...p}
      d={
        <>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </>
      }
    />
  ),
  Star: (p) => (
    <Icon
      {...p}
      d={
        <>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </>
      }
    />
  ),
  Upload: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </>
      }
    />
  ),
  Camera: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </>
      }
    />
  ),
  Loader: (p) => (
    <Icon
      {...p}
      className="spin"
      d={
        <>
          <path d="M12 2v4" />
          <path d="m16.2 7.8 2.9-2.9" />
          <path d="M18 12h4" />
          <path d="m16.2 16.2 2.9 2.9" />
          <path d="M12 18v4" />
          <path d="m4.9 19.1 2.9-2.9" />
          <path d="M2 12h4" />
          <path d="m4.9 4.9 2.9 2.9" />
        </>
      }
    />
  ),
  Layers: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </>
      }
    />
  ),
  Dot: (p) => (
    <Icon
      {...p}
      d={
        <>
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </>
      }
    />
  ),
  ArrowRight: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      }
    />
  ),
  ArrowLeft: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      }
    />
  ),
  RefreshCw: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </>
      }
    />
  ),
  Weight: (p) => (
    <Icon
      {...p}
      d={
        <>
          <circle cx="12" cy="5" r="3" />
          <path d="M6.5 8a2 2 0 0 0-1.905 1.388l-1.5 5A2 2 0 0 0 5 17h14a2 2 0 0 0 1.905-2.612l-1.5-5A2 2 0 0 0 17.5 8z" />
        </>
      }
    />
  ),
  FileText: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </>
      }
    />
  ),
  Monitor: (p) => (
    <Icon
      {...p}
      d={
        <>
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </>
      }
    />
  ),
  Smartphone: (p) => (
    <Icon
      {...p}
      d={
        <>
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <path d="M12 18h.01" />
        </>
      }
    />
  ),
  Lightbulb: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </>
      }
    />
  ),
  Box: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </>
      }
    />
  ),
  KeyRound: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
          <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
        </>
      }
    />
  ),
  Languages: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="m5 8 6 6" />
          <path d="m4 14 6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" />
          <path d="M14 18h6" />
        </>
      }
    />
  ),
  Gauge: (p) => (
    <Icon
      {...p}
      d={
        <>
          <path d="m12 14 4-4" />
          <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </>
      }
    />
  ),
};
