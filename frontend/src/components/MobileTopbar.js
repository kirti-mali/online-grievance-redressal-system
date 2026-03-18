import { useLocation } from 'react-router-dom';

const routeLabels = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Manage Users',
  '/admin/grievances': 'Manage Grievances',
  '/admin/categories': 'Categories',
  '/admin/reports': 'Reports',
  '/staff/dashboard': 'Dashboard',
  '/staff/grievances': 'My Grievances',
  '/staff/resolutions': 'My Resolutions',
  '/citizen/dashboard': 'Dashboard',
  '/citizen/raise-grievance': 'File Grievance',
  '/citizen/my-grievances': 'My Grievances',
  '/citizen/track': 'Track Status',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

const MobileTopbar = () => {
  const { pathname } = useLocation();
  const label = Object.entries(routeLabels).find(([path]) => pathname.startsWith(path))?.[1] || 'GRS';

  return (
    <div className="mobile-topbar">
      {label}
    </div>
  );
};

export default MobileTopbar;
