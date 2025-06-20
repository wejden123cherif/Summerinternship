import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex flex-col items-center">
      <Image
        src="/images/logo/logo.png" // Changed to logo.png as per your intention
        alt="logo"
        width={160} // Keep original width
        height={70} // Keep original height
        // Tailwind's responsive images usually handle width/height well.
        // If you want a fixed width, use Tailwind classes like w-64, or explicit style
        style={{ width: "250px", height: "auto" }} // Use 'px' for explicit pixel values in style prop
        quality={100}
      />
  <span className="text-sm text-gray-600 dark:text-gray-300 mt-1">سمارتوفيت</span>
    </Link>
  );
};

export default Logo;
