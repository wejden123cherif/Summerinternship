'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react'; // Good, no /dist/iconify.js needed
// import { instructorData } from '@/app/api/data';

interface instructorDetailsPageProps {
  params: {
    instructorId: string;
  };
}

const InstructorDetailsPage = ({ params }: instructorDetailsPageProps) => {
  const { instructorId } = params;
  type Course = {
        id: number;
        image_url: string;
        instructor: instructor;
        price: number;
        sessions_nbre: number;
        student_count: number;
        title: string;
        description: string;
        level: string;
    };
    type instructor = {
        id: number;
        name: string;
        bio: string;
        specialization: string;
        email: string;
        certifications: Course[];
    };

    const [instructorData, setinstructor] = useState<instructor[]>([]);
            useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`http://${process.env.BACKEND_URL}:5000/get_instructors`);
      const data: instructor[] = await response.json();
      setinstructor(data);
    } catch (error) {
      console.error('Error fetching instructor data:', error);
    }
  };

  fetchData();
}, []);


  const instructor = instructorData.find(c => c.id === Number(instructorId));

 
  if (!instructor) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-12 text-center" dir="rtl">
        <h1 className="text-4xl font-bold text-red-600">عذرًا، لم يتم العثور على المدرب المطلوب.</h1>
        <p className="mt-4 text-lg text-gray-700">يرجى التحقق من الرابط والمحاولة مرة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-20 sm:pt-24 md:pt-32 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-5xl" dir="rtl">
      {/* Centered Instructor Name as Title */}
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mt-12 border border-blue-200 animate-fade-in">
        
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-700 to-teal-500 z-0" />

          {/* Instructor name */}
          <h1 className="relative z-10 text-center pt-8 px-4 text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tight">
            {instructor.name}
          </h1>
        </div>
      
      
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Instructor Details */}
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 border-b-2 border-blue-200 pb-2">
              حول المدرب
            </h2>
            <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
              {instructor.bio || 'لا توجد سيرة ذاتية متاحة.'}
            </p>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 border-b-2 border-blue-200 pb-2">
              التخصص
            </h2>
            <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
              {instructor.specialization || 'غير محدد.'}
            </p>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 border-b-2 border-blue-200 pb-2">
              تواصل مع المدرب
            </h2>
            <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6 flex items-center">
              <Icon icon="mdi:email" className="ml-2 sm:ml-3 text-blue-600 text-lg sm:text-xl md:text-2xl" />
              <a
                href={`mailto:${instructor.email}`}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {instructor.email || 'غير متوفر.'}
              </a>
            </p>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 border-b-2 border-blue-200 pb-2">
              الشهادات
            </h2>
            {instructor.certifications && instructor.certifications.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
                {instructor.certifications.map((cert) => (
                  <li
                    key={cert.id}
                    className="border border-gray-200 p-3 sm:p-4 md:p-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      <Image
                        src={cert.image_url || 'https://via.placeholder.com/100'}
                        alt={cert.title}
                        width={100}
                        height={100}
                        className="rounded-md object-cover shadow-sm sm:w-[100px] sm:h-[100px] w-[80px] h-[80px]"
                      />
                      <div className="text-center">
                        <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-800 mb-1 sm:mb-2">
                          {cert.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">
                          {cert.description || 'لا يوجد وصف متاح.'}
                        </p>
                        <a
                          href={`/courses/${cert.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs sm:text-sm transition-colors duration-200"
                        >
                          عرض الدورة
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic text-sm sm:text-base">لا توجد شهادات متاحة.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailsPage;