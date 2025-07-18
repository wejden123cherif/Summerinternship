"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";

const Courses = () => {
    type Course = {
        id: number;
        image_url: string;
        price: number;
        instructor_name: string;
        sessions_nbre: number;
        student_count: number;
        title: string;
        level: string;
        description: string;
    };
  
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 2,
        arrows: false,
        autoplay: true,
        speed: 500,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1200,
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

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;

        return (
            <>
                {Array(fullStars).fill(<Icon icon="tabler:star-filled" className="text-yellow-500 text-xl inline-block" />)}
                {halfStars > 0 && <Icon icon="tabler:star-half-filled" className="text-yellow-500 text-xl inline-block" />}
                {Array(emptyStars).fill(<Icon icon="tabler:star-filled" className="text-gray-400 text-xl inline-block" />)}
            </>
        );
    };

    const [courseData, setCourse] = useState<Course[]>([]);
        useEffect(() => { 
            fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}:5000/get_bestsellers`)
                .then(response => response.json())
                .then((data: Course[]) => setCourse(data))
                .catch(error => console.error('Error fetching course data:', error));
        }, []);

    

    return (
        <section id="courses" dir="rtl" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        {/* Static Introductory Content */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            الدورات الأكثر شهرة
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-100">
            اكتشف مجموعتنا من الدورات المصممة لتعزيز مهاراتك المهنية وتحقيق أهدافك التعليمية. كل دورة تقدم محتوى عمليًا وشهادة معترف بها لدعم مسيرتك المهنية.
          </p>
        </div>

        {/* Slider */}
        <Slider {...settings}>
          {courseData.map((items, i) => (
            <div key={i} className="px-3">
              <div className="bg-white m-3 mb-12 p-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 h-full">
                {/* Image Section */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={items.image_url}
                    alt={items.title}
                    width={370}
                    height={262}
                    className="object-cover w-full h-[262px] rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute right-4 bottom-4 bg-teal-500 rounded-full px-6 py-2">
                    <span className="text-white text-sm font-semibold uppercase">
                      الأكثر مبيعًا
                    </span>
                  </div>
                </div>

                {/* Course Info Section */}
                <div className="pt-6 space-y-4">
                  <Link
                    href={`/courses/${items.id}`}
                    className="text-2xl font-bold text-gray-900 hover:text-blue-700 transition-colors duration-300 line-clamp-2"
                  >
                    {items.title}
                  </Link>
                  
                  <h3 className="text-base font-medium text-gray-600">{items.instructor_name}</h3>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-3xl font-bold text-blue-700">${items.price}</span>
                    <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                      {items.instructor_name}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:notebook-minimalistic-outline" className="text-blue-700 text-xl" />
                      <span className="text-sm font-medium text-gray-700">{items.sessions_nbre} دروس</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:users-group-rounded-linear" className="text-blue-700 text-xl" />
                      <span className="text-sm font-medium text-gray-700">{items.student_count} طالب</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:star-linear" className="text-blue-700 text-xl" />
                      <span className="text-sm font-medium text-gray-700">{items.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* Static CTA Section */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6 animate-fade-in delay-200">
            هل أنت مستعد للارتقاء بمهاراتك؟ تصفح مجموعتنا الكاملة من الدورات وابدأ رحلتك التعليمية اليوم!
          </p>
          <Link
            href="/courses"
            className="inline-block bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-xl hover:bg-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            استكشف جميع الدورات
          </Link>
        </div>
      </div>
    </section>
    );
}
export default Courses;