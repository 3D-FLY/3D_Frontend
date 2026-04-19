import WhatCanYouSellMobile from "./WhatCanYouSellMobile.js";
import WhatCanYouSellDesktop from "./WhatCanYouSellDesktop.jsx";



export default function WhatCanYouSell() {
  return (
    <>
      <div className="md:hidden">
        <WhatCanYouSellMobile />
      </div>

      <div className="hidden md:block">
        <WhatCanYouSellDesktop />
      </div>
    </>
  );
}