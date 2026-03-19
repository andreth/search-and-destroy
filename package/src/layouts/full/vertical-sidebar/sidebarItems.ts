export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  isPro?: boolean
}

const sidebarItem: menu[] = [
  { header: "Home" },
  {
    title: "Modern",
    icon: "home-smile-linear",
    to: "/",
    isPro: false,
  },

  { header: "Administration" },
  {
    title: "Utilisateurs",
    icon: "users-group-two-rounded-linear",
    to: "/admin/users",
    isPro: false,
  },
  {
    title: "Niveaux",
    icon: "crown-line-duotone",
    to: "/admin/levels",
    isPro: false,
  },
  {
    title: "Unités tank",
    icon: "tabler:tank",
    to: "/admin/tanks",
    isPro: false,
  },
  {
    title: "Unités avion",
    icon: "tabler:plane",
    to: "/admin/planes",
    isPro: false,
  },
  {
    title: "Ressources de base",
    icon: "tabler:package",
    to: "/admin/resources",
    isPro: false,
  },

  { header: "PAGES" },
  {
    title: "Tables",
    icon: "tablet-linear",
    to: "#",

    children: [
      {
        title: 'Basic Table',
        to: '/shadcn-table/basic',
        isPro: false,
      },
      {
        title: 'Hover Table',
        to: '/shadcn-table/hover',
        isPro: false,
      },

    ]

  },
  {
    title: 'Form',
    icon: 'document-add-linear',
    to: '/utilities/form',
    isPro: false,

  }, {
    title: 'User Profile',
    icon: 'user-circle-linear',
    to: '/user-profile',
    isPro: false,

  },
  { header: "Apps" },
  {
    title: 'Notes',
    icon: 'notes-linear',
    to: '/apps/notes',
    isPro: false,
  },
  {
    title: 'Tickets',
    icon: 'ticker-star-linear',
    to: '/apps/tickets',
    isPro: false,
  },
  {
    title: 'Blog',
    icon: 'sort-by-alphabet-linear',
    to: '/',
    children: [
      {
        title: 'Blog Posts',
        to: '/apps/blog/post',
        isPro: false,
      },
      {
        title: 'Blog Details',
        to: '/apps/blog/early-black-friday-amazon-deals-cheap-tvs-headphones',
        isPro: false,
      }
    ]
  },

  { header: 'UI ELEMENTS' },
  {
    title: 'Shadcn',
    icon: 'slash-square-linear',
    to: '/',
    children: [
      {
        title: 'Avatar',
        to: 'https://vuejs.tailwind-admin.com/components/ui/avatar',
        isPro: false,
      },
      {
        title: 'Alert',
        to: 'https://vuejs.tailwind-admin.com/components/ui/alert',
        isPro: false,
      },
      {
        title: 'Badge',
        to: 'https://vuejs.tailwind-admin.com/components/ui/badge',
        isPro: false,
      },
      {
        title: 'Breadcrumb',
        to: 'https://vuejs.tailwind-admin.com/components/ui/breadcrumb',
        isPro: false,
      },
      {
        title: 'Carousel',
        to: 'https://vuejs.tailwind-admin.com/components/ui/carousel',
        isPro: false,
      },
      {
        title: 'Card',
        to: 'https://vuejs.tailwind-admin.com/components/ui/card',
        isPro: false,
      },
      {
        title: 'Dropdown',
        to: 'https://vuejs.tailwind-admin.com/components/ui/dropdown',
        isPro: false,
      },

      {
        title: 'Dialog',
        to: 'https://vuejs.tailwind-admin.com/components/ui/dialog',
        isPro: false,
      },
      {
        title: 'Date Picker',
        to: 'https://vuejs.tailwind-admin.com/components/ui/datepicker',
        isPro: false,
      },

      {
        title: 'Skeleton',
        to: 'https://vuejs.tailwind-admin.com/components/ui/skeleton',
        isPro: false,
      },
      {
        title: 'Tabs',
        to: 'https://vuejs.tailwind-admin.com/components/ui/tabs',
        isPro: false,
      },
      {
        title: 'Tooltip',
        to: 'https://vuejs.tailwind-admin.com/components/ui/tooltip',
        isPro: false,
      },
    ]
  },

  { header: 'FORM ELEMENTS' },
  {
    title: 'Shadcn Forms',
    icon: 'banknote-2-linear',
    to: '/',
    children: [
      {
        title: 'Button',
        to: 'https://vuejs.tailwind-admin.com/components/ui/button',
        isPro: false,
      },
      {
        title: 'Input',
        to: 'https://vuejs.tailwind-admin.com/components/form/input',
        isPro: false,
      },
      {
        title: 'Select',
        to: 'https://vuejs.tailwind-admin.com/components/form/select',
        isPro: false,
      },
      {
        title: 'Checkbox',
        to: 'https://vuejs.tailwind-admin.com/components/form/checkbox',
        isPro: false,
      },
      {
        title: 'Radio',
        to: 'https://vuejs.tailwind-admin.com/components/form/radiogroup',
        isPro: false,
      },
      {
        title: 'Combobox',
        to: 'http://vuejs.tailwind-admin.com/components/form/combobox',
        isPro: false,
      },
      {
        title: 'Command',
        to: 'https://vuejs.tailwind-admin.com/components/form/command',
        isPro: false,
      },
    ]
  },

  { header: "Widgets" },
  {
    title: 'Cards',
    icon: 'card-linear',
    to: '/',
    children: [
      {
        title: 'TopCards',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/cards#topCards',
        isPro: false,
      },
      {
        title: 'SocialCards',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/cards#socialcards',
        isPro: false,
      },
      {
        title: 'Best Selling Product',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/cards#bestsellingproduct',
        isPro: false,
      },
      {
        title: 'Payment Gateway',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/cards#paymentgateway',
        isPro: false,
      },
      {
        title: 'Recent Transaction',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/cards#recenttransactioncard',
        isPro: false,
      },
      {
        title: 'Follow Artists',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/cards#followartistscard',
        isPro: false,
      },
      {
        title: 'My Friends ',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/cards#myfriendscard',
        isPro: false,
      },
      {
        title: 'Favourite Artists ',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/cards#favouriteartistscard',
        isPro: false,
      },
      {
        title: 'Upcoming Activity ',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/cards#upcomingactivitycard',
        isPro: false,
      },
    ]
  },

  {
    title: 'Banners',
    icon: 'object-scan-linear',
    to: '/',
    children: [
      {
        title: 'Download Banner ',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/banners#downloadbanner',
        isPro: false,
      },
      {
        title: 'Empty Banner',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/banners#emptybanner',
        isPro: false,
      },
      {
        title: 'Error Banner',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/banners#errorbanner',
        isPro: false,
      },
      {
        title: 'Mutual Friend Banner',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/banners#mutualfriendsbanner',
        isPro: false,
      },
      {
        title: 'Notification Banner',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/banners#notificationsbanner',
        isPro: false,
      },
      {
        title: 'Welcome Banner',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/banners#welcomebanner1',
        isPro: false,
      },

    ]
  },

  {
    title: 'Charts',
    icon: 'pie-chart-2-linear',
    to: '/',
    children: [
      {
        title: 'Revenue Updates',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#revenueupdateschart',
        isPro: false,
      },
      {
        title: 'Yearly Breakup',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#yearlybreakupchart',
        isPro: false,
      },
      {
        title: 'Monthly Earning',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#monthlyearning',
        isPro: false,
      },
      {
        title: 'Employee Salary',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#yearlysaleschart',
        isPro: false,
      },
      {
        title: 'Customers Chart',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#customerschart',
        isPro: false,
      },
      {
        title: 'Projects Chart',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#projectschart',
        isPro: false,
      },
      {
        title: 'Weekly Stats',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#weeklystatschart',
        isPro: false,
      },
      {
        title: 'Expense Chart',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#expancechart',
        isPro: false,
      },
      {
        title: 'Sales Chart',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#salesoverviewchart',
        isPro: false,
      },
      {
        title: 'Sales Growth Chart',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#salesgrowthchart',
        isPro: false,
      },
      {
        title: 'Incremented Sales',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#incrementedsaleschart',
        isPro: false,
      },
      {
        title: 'Use Activity',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#useactivitychart',
        isPro: false,
      },
      {
        title: 'Segmentation',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#customersegmentationchart',
        isPro: false,
      },
      {
        title: 'Monthly Earning',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#monthlyearningecomchart',
        isPro: false,
      },
      {
        title: 'Quarterly Status',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#quarterlystatuschart',
        isPro: false,
      },
      {
        title: 'Weekly Sales',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#weeklysaleschart',
        isPro: false,
      },
      {
        title: 'Total Assets',
        to: 'https://vuejs.tailwind-admin.com/ui-blocks/charts#totalassetschart',
        isPro: false,
      },

    ]
  },

  { header: "Icons" },
  {
    title: 'Iconify Icons',
    to: '/icons/solar',
    isPro: false,
    icon: "structure-linear",
  },






  { header: 'Auth' },
  {
    title: 'Login',
    icon: 'login-2-linear',
    to: '#',

    children: [
      {
        title: 'Boxed Login',
        to: '/auth/login2',
        isPro: false,
      }
    ]
  },
  {
    title: 'Register',
    icon: 'user-plus-rounded-linear',
    to: '#',
    isPro: true,
    children: [
      {
        title: 'Boxed Register',
        to: '/auth/register2',
        isPro: false,
      }
    ]
  },

  { header: "Other" },


  {
    title: "Disabled",
    icon: "forbidden-circle-linear",
    disabled: true,
    to: "#",
    isPro: false,
  },
  {
    title: "Sub Caption",
    icon: "star-fall-minimalistic-2-linear",
    subCaption: "This is the subtitle",
    to: "#",
    isPro: false,
  },
  {
    title: "Chip",
    icon: "shield-check-linear",
    chip: "9",
    chipColor: "surface",
    chipBgColor: "primary",
    to: "#",
    isPro: false,
  },
  {
    title: "Outlined",
    icon: "smile-circle-linear",
    chip: "outline",
    chipColor: "primary",
    chipVariant: "outline",
    to: "#",
    isPro: false,
  },
  {
    title: "External Link",
    icon: "link-broken-minimalistic-linear",
    to: "https://google.com",
    type: "external",
    isPro: false,
  },
];

export default sidebarItem;