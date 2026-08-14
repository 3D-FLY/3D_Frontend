import React from "react";
import FacebookSvg from "../../assets/icons/footer/Facebook.svg?react";
import InstagramSvg from "../../assets/icons/footer/Instagram.svg?react";
import LinkedInSvg from "../../assets/icons/footer/Linkdin.svg?react";

type SocialIconProps = {
  href: string;
  icon: React.ReactNode;
};

function SocialIcon({ href, icon }: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-8 h-8 md:w-11 md:h-11 flex-shrink-0"
    >
      {icon}
    </a>
  );
}

export function FooterSocialIcons({ className = "flex items-center gap-2" }: { className?: string }) {
  return (
    <div className={className}>
      <SocialIcon href="https://facebook.com/" icon={<FacebookSvg className="w-full h-full" />} />
      <SocialIcon href="https://instagram.com/" icon={<InstagramSvg className="w-full h-full" />} />
      <SocialIcon href="https://linkedin.com/" icon={<LinkedInSvg className="w-full h-full" />} />
    </div>
  );
}
