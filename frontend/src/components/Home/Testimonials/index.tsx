"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

const Testimonial = () => {

    type Feedback = {
        id: number;
        comment: string;
        username: string;
        userimage: string;
    };
    const settings = {
        dots: true,
        dotsClass: "slick-dots",
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 2,
        arrows: false,
        autoplay: true,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    
    const [TestimonialData, setFeedback] = useState<Feedback[]>([]);
            useEffect(() => { 
                fetch(`/api/get_feedbacks`)
                    .then(response => response.json())
                    .then((data: Feedback[]) => setFeedback(data))
                    .catch(error => console.error('Error fetching feedback data:', error));
            }, []);




    return (
        <section id="testimonial" className='scroll-mt-32'>
            <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4'>
                <Slider {...settings}>
                    {TestimonialData.map((items, i) => (
                        <div key={i}>
                            <div className={`bg-white rounded-2xl m-4 p-5 my-20 relative ${i % 2 ? 'shadow-testimonial-shadow2' : 'shadow-testimonial-shadow1'}`}>
                                <div className="absolute top-[-45px]">
                                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                                    <Image src={items.userimage} alt={items.username} width={100} height={100} className="inline-block" />
                                </div>
                                <h4 className='text-base font-normal text-darkgray my-4'>{items.comment}</h4>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className='text-lg font-medium text-darkbrown pt-4 pb-2'>{items.username}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default Testimonial;
