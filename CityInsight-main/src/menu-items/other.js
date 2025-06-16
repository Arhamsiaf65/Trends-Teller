// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'live-stream',
  type: 'group',
  title:'Live Stream',
  children: [
    {
      id: 'live-stream',
      title: 'Live Stream',
      type: 'item',
      url: '/admin/live-stream',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    
  ]
};

export default other;
