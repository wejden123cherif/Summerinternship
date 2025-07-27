"use client"
import Image from "next/image";
import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TruestedCompanies } from "../../../app/api/data";

// CAROUSEL SETTINGS
const Companies = () => {

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        rtl: true, // Added for Right-to-Left support
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    rtl: true // Ensure RTL is applied to responsive settings as well
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    rtl: true // Ensure RTL is applied to responsive settings as well
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    rtl: true // Ensure RTL is applied to responsive settings as well
                }
            }
        ]
    };

    return (
        <section id='companies' className='text-center scroll-mt-64' dir="rtl"> {/* Added dir="rtl" for the overall section */}
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                {/* Translated headline to Arabic and aligned right for RTL context */}
                <h2 className="text-midnight_text text-2xl font-semibold text-right mx-auto max-w-lg">
                    موثوق بنا من قبل شركات بجميع الأحجام
                </h2> {/* Arabic for "Trusted by companies of all sizes" */}
                <div className="py-14 border-b ">
                    <Slider {...settings}>
                        {TruestedCompanies.map((item, i) =>
                            <div key={i}>
                                {/* Image alt text might also need localization if it's user-facing */}
                                <Image src={item.imgSrc} alt={item.imgSrc} width={116} height={36} />
                            </div>
                        )}
                    </Slider>
                </div>
            </div>
        </section>
    )

}

export default Companies;