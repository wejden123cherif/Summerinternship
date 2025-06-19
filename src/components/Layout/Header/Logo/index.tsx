import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex flex-col items-center">
      <Image
        src="/images/logo/logo.png"
        alt="logo"
        width={160}
        height={70}
        style={{ width: "250", height: "auto" }}
        quality={100}
      />
  <span className="text-sm text-gray-600 dark:text-gray-300 mt-1">سمارتوفيت</span>
    </Link>
  );
};

export default Logo;
