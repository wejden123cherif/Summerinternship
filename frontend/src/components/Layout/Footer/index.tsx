"use client";
import Link from "next/link";
import Logo from "../Header/Logo";
import { Icon } from "@iconify/react/dist/iconify.js";
import { headerData } from "../Header/Navigation/menuData";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();
  return (
    <footer className="bg-deepSlate py-10" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8">

          {/* Logo and Social Icons - RIGHTMOST in RTL */}
          <div className='col-span-4 md:col-span-12 lg:col-span-4 flex '>
            <div className={`flex flex-col ${i18n.language === 'ar' ? 'items-end text-right' : 'items-start text-left'}`}>
              <Logo />

              {/* Social icons under logo */}
              <div className={`flex gap-4 ${i18n.language === 'ar' ? 'justify-start' : 'justify-end'}`}>
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
            <h3 className={`mb-4 text-2xl font-medium ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>{t('footer.links')}</h3>
            <ul>
              <li><a href="/">{t('nav.home')}</a></li>
              <li><a href="/#courses">{t('nav.courses')}</a></li>
              <li><a href="/#companies">{t('nav.partners')}</a></li>
              <li><a href="/#testimonial">{t('nav.testimonials')}</a></li>
              <li><a href="/#newsletter">{t('nav.support')}</a></li>
            </ul>
          </div>

          {/* Other */}
          <div className="col-span-2">
            <h3 className={`mb-4 text-2xl font-medium ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>{t('footer.other')}</h3>
            <ul>
              <li><a href="/">{t('footer.aboutUs')}</a></li>
              <li><a href="/">{t('footer.ourTeam')}</a></li>
              <li><a href="/">{t('footer.jobs')}</a></li>
              <li><a href="/">{t('footer.services')}</a></li>
              <li><a href="/">{t('footer.contactUs')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className='col-span-4 md:col-span-4 lg:col-span-4'>
            <div className={`flex items-center gap-2 ${i18n.language === 'ar' ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}>
              <Icon icon="tabler:brand-google-maps" className={`text-primary text-3xl inline-block ${i18n.language === 'ar' ? 'ms-2' : 'me-2'}`} />
              <h5 className={`text-lg text-black/60 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>{t('address.street')}</h5>
            </div>
            <div className={`flex gap-2 mt-10 ${i18n.language === 'ar' ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}>
              <Icon icon="tabler:phone" className={`text-primary text-3xl inline-block ${i18n.language === 'ar' ? 'ms-2' : 'me-2'}`} />
              <h5 className="text-lg text-black/60">+45 3411-4411</h5>
            </div>
            {/* EMAIL SECTION */}
            <div className={`flex gap-2 mt-10 ${i18n.language === 'ar' ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}>
              <Icon
                icon="tabler:folder"
                className={`text-primary text-3xl inline-block ${i18n.language === 'ar' ? 'ms-2' : 'me-2'}`}
              />
              <h5 className="text-lg text-black/60">info@gmail.com</h5>
            </div>
          </div>
        </div>

        <div className={`mt-10 lg:flex items-center justify-between ${i18n.language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <h4 className={`text-black/50 text-sm text-center font-normal ${i18n.language === 'ar' ? 'lg:text-end' : 'lg:text-start'}`}>
            {t('footer.copyright')}
            <a href="https://getnextjstemplates.com/" target="_blank" className="hover:text-primary">
              GetNextJsTemplates.com
            </a>
          </h4>
          <div className={`flex gap-5 mt-5 lg:mt-0 ${i18n.language === 'ar' ? 'lg:justify-end' : 'lg:justify-start'}`}>
            <a href="/">{t('footer.privacyPolicy')}</a>
            <a href="/">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;