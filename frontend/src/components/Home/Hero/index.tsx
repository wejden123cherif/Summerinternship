"use client";
import Image from 'next/image';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t, i18n } = useTranslation();
    return (
        <section id="home-section" className='bg-slateGray' dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-20">
                <div className='grid grid-cols-1 lg:grid-cols-12 space-x-1 lg:space-x-reverse items-center'>
                    {/* Text Section */}
                    <div className='col-span-6 flex flex-col gap-8 text-right'>

                        {/* ✅ Smartovate Description (replaces discount line) */}
                        <p className={`text-black/60 font-normal text-center ${i18n.language === 'ar' ? 'text-sm sm:text-base lg:text-right' : 'text-xs sm:text-sm lg:text-left'}`}>
                            {t('hero.companyDescription')}
                        </p>

                        {/* ✅ Updated Headline */}
                        <h1 className={`text-midnight_text font-semibold pt-5 lg:pt-0 text-center ${i18n.language === 'ar' ? 'text-4xl sm:text-5xl lg:text-right' : 'text-3xl sm:text-4xl lg:text-left'}`}>
                            {t('hero.headline')}
                        </h1>

                        {/* ✅ Updated Subheadline */}
                        <h3 className={`text-black/70 pt-5 lg:pt-0 text-center ${i18n.language === 'ar' ? 'text-lg lg:text-right' : 'text-base lg:text-left'}`}>
                            {t('hero.subheadline')}
                        </h3>

                        {/* Search Input */}
                        <div className="relative rounded-full pt-5 lg:pt-0">
                            <input
                                type="text"
                                name="q"
                                className={`py-6 lg:py-8 pr-8 pl-20 text-lg w-full text-black rounded-full focus:outline-none shadow-input-shadow ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
                                placeholder={t('hero.searchPlaceholder')}
                                autoComplete="off"
                            />
                            <button className={`bg-secondary rounded-full absolute left-2 top-2 ${i18n.language === 'ar' ? 'p-5' : 'p-4'}`}>
                                <Icon
                                    icon="solar:magnifer-linear"
                                    className={`text-white inline-block ${i18n.language === 'ar' ? 'text-4xl' : 'text-3xl'}`}
                                />
                            </button>
                        </div>

                        {/* Features */}
                        <div className={`flex items-center justify-between pt-10 lg:pt-4 ${i18n.language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`flex gap-2 ${i18n.language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Image src="/images/banner/check-circle.svg" alt="check-image" width={30} height={30} className='smallImage' />
                                <p className={`font-normal text-black ${i18n.language === 'ar' ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'}`}>{t('hero.flexibility')}</p>
                            </div>
                            <div className={`flex gap-2 ${i18n.language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Image src="/images/banner/check-circle.svg" alt="check-image" width={30} height={30} className='smallImage' />
                                <p className={`font-normal text-black ${i18n.language === 'ar' ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'}`}>{t('hero.learningPath')}</p>
                            </div>
                            <div className={`flex gap-2 ${i18n.language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Image src="/images/banner/check-circle.svg" alt="check-image" width={30} height={30} className='smallImage' />
                                <p className={`font-normal text-black ${i18n.language === 'ar' ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'}`}>{t('hero.community')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className={`col-span-6 flex justify-center ${i18n.language === 'ar' ? 'order-first lg:order-last' : 'order-first lg:order-last'}`}>
                        <Image 
                            src="/images/banner/oman6.png" 
                            style={{ 
                                borderRadius: "20px", 
                                marginTop: "50px",
                                marginRight: i18n.language === 'ar' ? "50px" : "0px",
                                marginLeft: i18n.language === 'ar' ? "0px" : "50px"
                            }} 
                            alt="nothing" 
                            width={800} 
                            height={805} 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
