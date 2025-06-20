import Link from "next/link";
import Logo from "../Header/Logo"; // Adjust path as per your project
import { Icon } from "@iconify/react/dist/iconify.js";
import { headerData } from "../Header/Navigation/menuData"; // Adjust path as per your project

const Footer = () => {
  return (
    <footer className="bg-deepSlate py-10" dir="rtl">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8">

          {/* Logo and Social Icons - RIGHTMOST in RTL */}
          <div className='col-span-4 md:col-span-12 lg:col-span-4 flex '>
            <div className="flex flex-col items-end text-right">
              <Logo />
  
              {/* Social icons under logo */}
              <div className='flex gap-4 justify-start'>
                <Link href="https://facebook.com" className='hover:text-primary text-black text-2xl'>
                  <Icon icon="tabler:brand-facebook" />
                </Link>
                <Link href="https://twitter.com" className='hover:text-primary text-black text-2xl'>
                  <Icon icon="tabler:brand-twitter" />
                </Link>
                <Link href="https://instagram.com" className='hover:text-primary text-black text-2xl'>
                  <Icon icon="tabler:brand-instagram" />
                </Link>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-2">
            <h3 className="mb-4 text-2xl font-medium text-right lg:text-right">روابط</h3>
            <ul>
              {headerData.map((item, index) => (
                <li key={index} className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other */}
          <div className="col-span-2">
            <h3 className="mb-4 text-2xl font-medium text-right lg:text-right">أخرى</h3>
            <ul>
              <li className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                <Link href="#">من نحن</Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                <Link href="#">فريقنا</Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                <Link href="#">الوظائف</Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                <Link href="#">الخدمات</Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                <Link href="#">تواصل معنا</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className='col-span-4 md:col-span-4 lg:col-span-4'>
            <div className="flex items-center gap-2 flex-row-reverse justify-end">
              <Icon icon="tabler:brand-google-maps" className="text-primary text-3xl inline-block ms-2" />
              <h5 className="text-lg text-black/60 text-right">925 شارع فيلبرت بنسلفانيا 18072</h5>
            </div>
            <div className="flex gap-2 mt-10 flex-row-reverse justify-end">
              <Icon icon="tabler:phone" className="text-primary text-3xl inline-block ms-2" />
              <h5 className="text-lg text-black/60">+45 3411-4411</h5>
            </div>
            <div className="flex gap-2 mt-10 flex-row-reverse justify-end">
              <Icon icon="tabler:folder" className="text-primary text-3xl inline-block ms-2" />
              <h5 className="text-lg text-black/60">info@gmail.com</h5>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
