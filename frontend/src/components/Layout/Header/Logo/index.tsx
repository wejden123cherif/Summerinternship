"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

const Logo: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <Link href="/" className={`flex flex-col ${i18n.language === 'ar' ? 'items-center' : 'items-start'}`}>
      <Image
        src="/images/logo/logo.png"
        alt="logo"
        width={160}
        height={70}
        style={{ width: "250px", height: "auto" }}
        quality={100}
      />
      <span className={`text-sm text-gray-600 dark:text-gray-300 mt-1 ${i18n.language === 'ar' ? 'text-center' : 'text-left'}`}>
        {i18n.language === 'ar' ? 'سمارتوفيت' : 'Smartovate'}
      </span>
    </Link>
  );
};

export default Logo;
