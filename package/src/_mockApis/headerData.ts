// project imports

import type {
  notificationType,
  profileType,
} from "../types/HeaderTypes";
//
// Notification
//


const notifications: notificationType[] = [
  {

    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {

    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {

    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {

    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
  {

    title: "Roman Joined the Team!",
    subtitle: "$230 deducted from account",
  },
];


//
// Profile
//



const profileDD: profileType[] = [
  {
    title: "My Profile",
    subtitle: "Account settings",
    url: "", // URL construite dynamiquement dans ProfileDD (vue user admin)
    img: "tabler:user",
  },
];




export {
  notifications,
  profileDD,



};
