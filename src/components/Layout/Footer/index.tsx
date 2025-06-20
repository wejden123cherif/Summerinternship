import Link from "next/link";
import Image from "next/image";
import Logo from "../Header/Logo";
import { Icon } from "@iconify/react/dist/iconify.js";
import { headerData } from "../Header/Navigation/menuData";

const footer = () => {
  return (
    <footer className="bg-deepSlate py-10" dir="rtl"> {/* Added dir="rtl" for right-to-left */}
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8">
          {/* First Column: Logo and Social Icons (Modified) */}
          <div className='col-span-4 md:col-span-12 lg:col-span-4'>
            {/* Wrapper for Logo to explicitly right-align it */}
            <div className='flex '>
              <Logo />
            </div>

            {/* Social icons section - now on its own line below the logo */}
            {/* The div naturally creates a new line. justify-end will align icons to the right. */}
            <div className='flex gap-8 mt-8 '>
              {/* Re-ordered Links to appear visually as Instagram, Twitter, Facebook from right-to-left */}
              <Link href="https://instagram.com" className='hover:text-primary text-black text-3xl'>
                <Icon icon="tabler:brand-instagram" />
              </Link>
              <Link href="https://twitter.com" className='hover:text-primary text-black text-3xl'>
                <Icon icon="tabler:brand-twitter" />
              </Link>
              <Link href="https://facebook.com" className='hover:text-primary text-black text-3xl'>
                <Icon icon="tabler:brand-facebook" />
              </Link>
            </div>
          </div>

          {/* Second Column: Links */}
          <div className="col-span-2">
            <h3 className="mb-4 text-2xl font-medium text-right lg:text-right">روابط</h3> {/* Arabic for "Links" */}
            <ul>
              {headerData.map((item, index) => (
                <li key={index} className="mb-2 text-black/50 hover:text-primary w-fit text-right"> {/* Adjusted text alignment */}
                  <Link href={item.href}>
                    {/* You'll need to translate item.label from headerData separately if it's not already dynamic */}
                    {item.label === 'Home' ? 'الرئيسية' : // Example translation
                     item.label === 'About' ? 'عنا' :
                     item.label === 'Services' ? 'خدماتنا' :
                     item.label === 'Contact' ? 'اتصل بنا' :
                     item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Third Column: Other */}
          <div className="col-span-2">
            <h3 className="mb-4 text-2xl font-medium text-right lg:text-right">أخرى</h3> {/* Arabic for "Other" */}
            <ul>
              <li className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                <Link href="#">
                  من نحن {/* Arabic for "About Us" */}
                </Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                <Link href="#">
                  فريقنا {/* Arabic for "Our Team" */}
                </Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                <Link href="#">
                  الوظائف {/* Arabic for "Career" */}
                </Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                <Link href="#">
                  الخدمات {/* Arabic for "Services" */}
                </Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit text-right">
                <Link href="#">
                  تواصل معنا {/* Arabic for "Contact" */}
                </Link>
              </li>
            </ul>
          </div>

          {/* Fourth Column: Contact Info (Address, Phone, Email) */}
          <div className='col-span-4 md:col-span-4 lg:col-span-4'>
            {/* ADDRESS SECTION */}
            <div className="flex items-center gap-2 flex-row-reverse justify-end"> {/* Flex adjustments for RTL */}
              <Icon
                icon="tabler:brand-google-maps"
                className="text-primary text-3xl inline-block ms-2" // Icon on the right, margin to its left
              />
              <h5 className="text-lg text-black/60 text-right">925 شارع فيلبرت بنسلفانيا 18072</h5> {/* Arabic for address */}
            </div>
            {/* PHONE SECTION */}
            <div className="flex gap-2 mt-10 flex-row-reverse justify-end"> {/* Flex adjustments for RTL */}
              <Icon
                icon="tabler:phone"
                className="text-primary text-3xl inline-block ms-2" // Icon on the right, margin to its left
              />
              <h5 className="text-lg text-black/60">+45 3411-4411</h5>
            </div>
            {/* EMAIL SECTION */}
            <div className="flex gap-2 mt-10 flex-row-reverse justify-end"> {/* Flex adjustments for RTL */}
              <Icon
                icon="tabler:folder"
                className="text-primary text-3xl inline-block ms-2" // Icon on the right, margin to its left
              />
              <h5 className="text-lg text-black/60">info@gmail.com</h5>
            </div>
          </div>
        </div>

        <div className='mt-10 lg:flex items-center justify-between flex-row-reverse'> {/* Flex adjustments for RTL */}
          <h4 className='text-black/50 text-sm text-center lg:text-end font-normal'>
            @2025 وكالة. جميع الحقوق محفوظة لـ{" "}
            <Link href="https://getnextjstemplates.com/" target="_blank" className="hover:text-primary">
              GetNextJsTemplates.com
            </Link>
          </h4> {/* Arabic copyright text */}
          <div className="flex gap-5 mt-5 lg:mt-0 lg:justify-end"> {/* Flex adjustments for RTL */}
            <Link href="/" target="_blank" className='text-black/50 text-sm font-normal hover:text-primary'>
              سياسة الخصوصية {/* Arabic for "Privacy policy" */}
            </Link>
            <Link href="/" target="_blank" className='text-black/50 text-sm font-normal hover:text-primary'>
              الشروط والأحكام {/* Arabic for "Terms & conditions" */}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default footer;
