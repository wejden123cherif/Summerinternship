import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    // Added 'float-right' to visually align this component to the right.
    // Note: In modern flexbox layouts (like your Header likely uses),
    // float properties might be overridden or behave unexpectedly.
    // The preferred method is to control positioning in the parent component
    // using flexbox properties and the dir="rtl" attribute on the parent.
    <Link href="/" className="float-right">
      <Image
        src="/images/logo/logo.svg"
        alt="logo"
        width={160}
        height={50}
        style={{ width: "auto", height: "auto" }}
        quality={100}
      />
    </Link>
  );
};

export default Logo;