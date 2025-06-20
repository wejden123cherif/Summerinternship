import Image from 'next/image';
import { Icon } from "@iconify/react/dist/iconify.js";

const Hero = () => {

    return (
        <section id="home-section" className='bg-slateGray' dir="rtl"> {/* Added dir="rtl" for right-to-left */}
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-20">
                {/* Reversed grid order for RTL on large screens */}
                <div className='grid grid-cols-1 lg:grid-cols-12 space-x-1 lg:space-x-reverse items-center'> {/* Adjusted spacing for RTL */}
                    <div className='col-span-6 flex flex-col gap-8 text-right'> {/* Align text to the right */}
                        <div className='flex gap-2 mx-auto lg:mx-0 lg:flex-row-reverse lg:justify-end'> {/* Reversed flex for icon and text */}
                            <Icon
                                icon="solar:verified-check-bold"
                                className="text-success text-xl inline-block ms-2" // Changed me-2 to ms-2 for RTL margin
                            />
                            <p className='text-success text-sm font-semibold text-center lg:text-right'>احصل على خصم 30% عند التسجيل الأول</p> {/* Arabic for "Get 30% off on first enroll" */}
                        </div>
                        <h1 className='text-midnight_text text-4xl sm:text-5xl font-semibold pt-5 lg:pt-0 text-center lg:text-right'>طور مهاراتك الهندسية معنا.</h1> {/* Arabic for headline */}
                        <h3 className='text-black/70 text-lg pt-5 lg:pt-0 text-center lg:text-right'>اكتسب المهارات من خلال دوراتنا وبتوجيه من شركات عالمية.</h3> {/* Arabic for sub-headline */}
                        <div className="relative rounded-full pt-5 lg:pt-0">
                            <input
                                type="text" // Changed to text as email address is not relevant for search
                                name="q"
                                className="py-6 lg:py-8 pr-8 pl-20 text-lg w-full text-black rounded-full focus:outline-none shadow-input-shadow text-right" // Changed pl-8 pr-20 to pr-8 pl-20, added text-right
                                placeholder="ابحث عن الدورات..." // Arabic for "search courses..."
                                autoComplete="off"
                            />
                            <button className="bg-secondary p-5 rounded-full absolute left-2 top-2"> {/* Changed right-2 to left-2 */}
                                <Icon
                                    icon="solar:magnifer-linear"
                                    className="text-white text-4xl inline-block"
                                />
                            </button>
                        </div>
                        <div className='flex items-center justify-between pt-10 lg:pt-4 flex-row-reverse'> {/* Reversed flex direction for RTL */}
                            <div className='flex gap-2 flex-row-reverse'> {/* Reversed flex for individual items */}
                                <Image src="/images/banner/check-circle.svg" alt="check-image" width={30} height={30} className='smallImage' />
                                <p className='text-sm sm:text-lg font-normal text-black'>مرونة</p> {/* Arabic for "Flexible" */}
                            </div>
                            <div className='flex gap-2 flex-row-reverse'> {/* Reversed flex for individual items */}
                                <Image src="/images/banner/check-circle.svg" alt="check-image" width={30} height={30} className='smallImage' />
                                <p className='text-sm sm:text-lg font-normal text-black'>مسار تعليمي</p> {/* Arabic for "Learning path" */}
                            </div>
                            <div className='flex gap-2 flex-row-reverse'> {/* Reversed flex for individual items */}
                                <Image src="/images/banner/check-circle.svg" alt="check-image" width={30} height={30} className='smallImage' />
                                <p className='text-sm sm:text-lg font-normal text-black'>مجتمع</p> {/* Arabic for "Community" */}
                            </div>
                        </div>
                    </div>
                    {/* The image column should visually appear on the right for RTL, so we don't need to change its order in the grid directly if the text column is moved to the left side in the markup */}
                    <div className='col-span-6 flex justify-center order-first lg:order-last'> {/* Changed order for image column */}
                        <Image src="/images/banner/mahila.png" alt="nothing" width={1000} height={805} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;
