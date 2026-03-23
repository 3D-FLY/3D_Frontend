import ConnectCopyImg from "./assets/images/Connect-copy .png";
import UploadImg from "./assets/images/Upload2.png";
import SellImg from "./assets/images/Sell.png";
import FullfillImg from "./assets/images/Fullfill.png";

// דסקטופ: iconWidth, iconHeight. מובייל: רוחב התמונה כאחוז מרוחב הכרטיס (כל הכרטיסים 270px כמו בדסקטופ)
export const howDoesItWorkSteps = [
  {
    imageSrc: ConnectCopyImg,
    title: "CONNECT",
    subtitle: "Link your store to 3D-FLY",
    description: "for free",
    iconWidth: 255,
    iconHeight: 189,
    iconWidthPercent: 80, // רוחב התמונה = 94% מרוחב הכרטיס
  },
  {
    imageSrc: UploadImg,
    title: "UPLOAD",
    subtitle: "Upload your 3D files and",
    description: "sync them to your store",
    iconWidth: 188,
    iconHeight: 162,
    iconWidthPercent: 50,
  },
  {
    imageSrc: SellImg,
    title: "SELL",
    subtitle: "production and shipment",
    description: "will automatically show up in 3D-FLY",
    iconWidth: 230,
    iconHeight: 156,
    iconWidthPercent: 60,
    iconPadding: "pr-10",
  },
  {
    imageSrc: FullfillImg,
    title: "FORGET",
    subtitle: "Let 3D-FLY handle ",
    description: "production and shipment",
    iconWidth: 200,
    iconHeight: 200,
    iconWidthPercent: 50,
  },
];
