import Image from 'next/image';
import { Icon } from "@iconify/react/dist/iconify.js";

const Hero = () => {
    return (
        <section id="home-section" className='bg-slateGray' dir="rtl">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-20">
                <div className='grid grid-cols-1 lg:grid-cols-12 space-x-1 lg:space-x-reverse items-center'>
                    {/* Text Section */}
                    <div className='col-span-6 flex flex-col gap-8 text-right'>

                        {/* ✅ Smartovate Description (replaces discount line) */}
                        <p className='text-black/60 text-sm sm:text-base font-normal text-center lg:text-right'>
                            سمارتوفيت شركة رائدة في تقديم حلول الذكاء الاصطناعي والسحابة لدعم النقل، الصحة، والسياحة في الخليج.
                        </p>

                        {/* ✅ Updated Headline */}
                        <h1 className='text-midnight_text text-4xl sm:text-5xl font-semibold pt-5 lg:pt-0 text-center lg:text-right'>
                            طوّر مهاراتك البرمجية معنا.
                        </h1>

                        {/* ✅ Updated Subheadline */}
                        <h3 className='text-black/70 text-lg pt-5 lg:pt-0 text-center lg:text-right'>
                            سمارتوفيت تقدم حلولاً سحابية وذكية لدعم النقل، الصحة، والسياحة في الخليج.
                        </h3>

                        {/* Search Input */}
                        <div className="relative rounded-full pt-5 lg:pt-0">
                            <input
                                type="text"
                                name="q"
                                className="py-6 lg:py-8 pr-8 pl-20 text-lg w-full text-black rounded-full focus:outline-none shadow-input-shadow text-right"
                                placeholder="ابحث عن الدورات..."
                                autoComplete="off"
                            />
                            <button className="bg-secondary p-5 rounded-full absolute left-2 top-2">
                                <Icon
                                    icon="solar:magnifer-linear"
                                    className="text-white text-4xl inline-block"
                                />
                            </button>
                        </div>

                        {/* Features */}
                        <div className='flex items-center justify-between pt-10 lg:pt-4 flex-row-reverse'>
                            <div className='flex gap-2 flex-row-reverse'>
                                <Image src="/images/banner/check-circle.svg" alt="check-image" width={30} height={30} className='smallImage' />
                                <p className='text-sm sm:text-lg font-normal text-black'>مرونة</p>
                            </div>
                            <div className='flex gap-2 flex-row-reverse'>
                                <Image src="/images/banner/check-circle.svg" alt="check-image" width={30} height={30} className='smallImage' />
                                <p className='text-sm sm:text-lg font-normal text-black'>مسار تعليمي</p>
                            </div>
                            <div className='flex gap-2 flex-row-reverse'>
                                <Image src="/images/banner/check-circle.svg" alt="check-image" width={30} height={30} className='smallImage' />
                                <p className='text-sm sm:text-lg font-normal text-black'>مجتمع</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className='col-span-6 flex justify-center order-first lg:order-last'>
                        <Image src="/images/banner/mahila.png" alt="nothing" width={1000} height={805} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
