import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  return (
    <>
    {/* // <Link component={RouterLink} to={'/admin/dashboard'} aria-label="theme-logo"> */}
      {/* <Logo /> */}
      <h1
           style={{ fontWeight: 'bold', height: '20px',fontSize: '30px', textDecoration: 'none' }}>
            <span style={{ color: '#673ab7' }}>Trends</span>{' '}
            <span style={{ color: '#3255F1' }}>Teller</span>
          </h1>
    </>
    // </Link>
  );
}
