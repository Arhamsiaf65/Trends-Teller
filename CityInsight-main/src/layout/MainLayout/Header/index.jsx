// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <>
      {/* logo & toggler button */}
      <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex' }}>
        <Box
          component="span"
          sx={{
            display: { xs: 'none', md: 'block' },
            flexGrow: 1,
            height: '10px' // adjust as you like
          }}
        >
           {/* <h1
           style={{ fontWeight: 'bold', height: '20px',fontSize: '28px', textDecoration: 'none' }}>
            <span style={{ color: '#673ab7' }}>Trends</span>{' '}
            <span style={{ color: '#3255F1' }}>Teller</span>
          </h1> */}
          <LogoSection />
        </Box>

        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            bgcolor: 'secondary.light',
            color: 'secondary.dark',
            mt:2,
            '&:hover': {
              bgcolor: 'secondary.dark',
              color: '#FFFFFF'
            }
          }}
          onClick={() => handlerDrawerOpen(!drawerOpen)}
          color="inherit"
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification */}
      {/* <NotificationSection /> */}

      {/* profile */}
      <ProfileSection />
    </>
  );
}
