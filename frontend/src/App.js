import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import MRoot from './Main/MRoot';
import MContent from './Main/MContent';
import MResorts from './Main/MResorts';
import MEvent from './Main/MEvent';
import MContact from './Main/MContact';
import ResortDetails from './Main/MDetails';
import MBookLog from './Main/MBookLog'
import Login from './components/Login';
import Register from './components/Register';
import ModeratorDashboard from './Moderator/ModeratorDashboard';
import { isAuthenticated, getRole } from './utils/auth';
import ADashboard from './Admin/ADashboard';
import AResortMngt from './Admin/AResortMngt';
import ARecentBookings from './Admin/ARecentBookings';
import ABooks from './Admin/ABooks';
import AdminRoot from './Admin/AdminRoot';
import ModRoot from './Moderator/ModRoot';
import NotFoundPage from './components/NotFoundPage';
import AAccMngt from './Admin/AAccMngt';
import MWed from './Main/evt&serv/MWed';
import MSe from './Main/evt&serv/MSe';
import MBirth from './Main/evt&serv/MBirth';
import MGat from './Main/evt&serv/MGat';
import MUserInfo from './Main/MUserInfo';
import ModMngt from './Moderator/ModMngt';
import ModRecentBookings from './Moderator/ModRecentBookings';
import MRecentBookings from './Main/MRecentBooking'
import AFinance from './Admin/AFinance';

const PrivateRoute = ({ role, children }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>{error}</div>; 

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  if (role && getRole() !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <MRoot />,
    children: [
      { path: '/', element: <MContent /> },
          { path: '/resorts', element: <MResorts /> },
          { path: '/event', element: <MEvent /> },
          { path:'/event/wedding', element:<MWed/>},
          { path:'/event/birthday', element:<MBirth/>},
          { path:'/event/gathering', element:<MGat/>},
          { path:'/event/se', element:<MSe/>},
          { path: '/contact', element: <MContact /> },
          { path: '/resorts/:id', element: <ResortDetails/> },
          { path: '/payment/:id', element: <MBookLog /> },
    ],
    errorElement: <NotFoundPage/>
  },
  {
    path: "/",
    element: isAuthenticated() ? <Navigate to={`/${getRole()}Dashboard`} replace /> : <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute role="admin">
        <AdminRoot />
      </PrivateRoute>
    ),
    children: [
      { path: '/admin', element: <ADashboard/>},
      { path:'/resortmngt', element:<AResortMngt/>},
      { path:'/books', element:<ABooks/>},
      { path:'/recent-bookings', element:<ARecentBookings />},
      { path:'/accmngt', element:<AAccMngt/>},
      { path:'/fee', element:<AFinance/>},
    ],
    
  },
  {
    path: "/",
    element: (
      <PrivateRoute role="moderator">
        <ModRoot/>
      </PrivateRoute>
    ),
    children: [
      {path: '/moderator', element: <ModeratorDashboard/>},
      {path: '/rmngt', element: <ModMngt/>},
      {path: '/mrecent-bookings', element: <ModRecentBookings/>},
    ],
  },
  {
    path: "/",
    element: (
      <PrivateRoute role="user">
        <MRoot/>
      </PrivateRoute>
    ),
    children: [
      { path: '/', element: <MContent /> },
          { path:'/userinfo', element: <MUserInfo/>},
          { path:'/mrecent', element: <MRecentBookings/>},
          { path: '/resorts', element: <MResorts /> },
          { path: '/event', element: <MEvent /> },
          { path:'/event/wedding', element:<MWed/>},
          { path:'/event/wedding', element:<MWed/>},
          { path:'/event/birthday', element:<MBirth/>},
          { path:'/event/gathering', element:<MGat/>},
          { path:'/event/se', element:<MSe/>},
          { path: '/contact', element: <MContact /> },
          { path: '/resorts/:id', element: <ResortDetails/> },
          { path: '/payment/:id', element: <MBookLog /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);


const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
