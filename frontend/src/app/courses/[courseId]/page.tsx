'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react'; // Good, no /dist/iconify.js needed
import Link from 'next/link';
// import { courseData } from '@/app/api/data';
import { loadStripe } from "@stripe/stripe-js";

interface CourseDetailsPageProps {
  params: {
    courseId: string;
  };
}

const CourseDetailsPage = ({ params }: CourseDetailsPageProps) => {
  const { courseId } = params;
type Course = {
        id: number;
        image_url: string;
        instructor: Instructor;
        price: number;
        sessions_nbre: number;
        student_count: number;
        title: string;
        description: string;
        level: string;
    };
type Instructor = {
        id: number;
        name: string;
        bio: string;
        specialization: string;
        email: string;
        certifications: Course[];
    };

    const [courseData, setCourse] = useState<Course[]>([]);
            useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`http://${process.env.BACKEND_URL}:5000/get_certifications`);
      const data: Course[] = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  fetchData();
}, []);


  const course = courseData.find(c => c.id === Number(courseId));
  
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

  if (!course) {
    return (
      // Increased padding here for the "not found" message as well
      <div className="container mx-auto px-4 pt-24 pb-12 text-center" dir="rtl">
        <h1 className="text-4xl font-bold text-red-600">عذرًا، لم يتم العثور على الدورة المطلوبة.</h1>
        <p className="mt-4 text-lg text-gray-700">الرجاء التحقق من الرابط والمحاولة مرة أخرى.</p>
      </div>
    );
  }

  // const renderStars = (rating: number) => {
  //   const fullStars = Math.floor(rating);
  //   const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  //   const emptyStars = 5 - fullStars - halfStars;

  //   return (
  //     <>
  //       {Array.from({ length: fullStars }).map((_, idx) => (
  //         <Icon key={`full-${idx}`} icon="tabler:star-filled" className="text-yellow-500 text-xl inline-block" />
  //       ))}
  //       {halfStars > 0 && <Icon icon="tabler:star-half-filled" className="text-yellow-500 text-xl inline-block" />}
  //       {Array.from({ length: emptyStars }).map((_, idx) => (
  //         <Icon key={`empty-${idx}`} icon="tabler:star-filled" className="text-gray-400 text-xl inline-block" />
  //       ))}
  //     </>
  //   );
  // };
  const handlePurchase = async (course: Course) => {
    console.log("Initiating purchase for course:", course.title);
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      alert("Stripe غير مُهيأ بشكل صحيح. يرجى التواصل مع الدعم.");
      console.error("STRIPE_PUBLISHABLE_KEY is not set");
      return;
    }
     const stripe = await stripePromise;
    if (!stripe) {
      alert("فشل تهيئة Stripe. يرجى التحقق من الإعدادات والمحاولة مرة أخرى.");
      console.error("Stripe failed to initialize");
      return;
    }

    try {
      const apiUrl = process.env.NODE_ENV === "production"
        ? `https://www.smartovateai.com/api/create-checkout-session`
        : `http://${process.env.BACKEND_URL}:5000/api/create-checkout-session`;
      console.log("Fetching checkout session from:", apiUrl);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificate_id: course.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server responded with ${response.status}: ${errorText}`);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Checkout session response:", data);
      if (data.error) {
        console.error("Checkout session error:", data.error);
        alert(`فشل بدء الدفع: ${data.error}`);
        return;
      }

      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (result.error) {
        console.error("Redirect to checkout error:", result.error.message);
        alert(`خطأ في الدفع: ${result.error.message}`);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      alert("حدث خطأ أثناء بدء الدفع. يرجى المحاولة لاحقًا.");
    }
  };

  return (
    // ** MODIFICATION 1: Increased padding-top (pt-28) on the main container **
    // pt-28 (112px) should provide enough space below most headers. Adjust as needed.
    // Kept pb-12 for bottom padding.
    <div className="container mx-auto px-4 pt-32 pb-20 lg:max-w-screen-xl md:max-w-screen-md" dir="rtl">
      {/* Hero Section */}
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mt-12 border border-blue-200 animate-fade-in">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-700 to-teal-500" />
        <div className="relative pt-24 pb-4 px-4 md:pt-28 md:pb-6 md:px-6 lg:pt-28 lg:pb-8 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            {/* Course Image */}
            <div className="w-full md:w-1/2 flex-shrink-0 pt-2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 transform hover:scale-[1.03] transition-transform duration-500 ease-out">
                <Image
                  src={course.image_url}
                  alt={course.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
            
            {/* Course Details */}
            <div className="w-full md:w-1/2 space-y-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight animate-fade-in">
                {course.title}
              </h1>
              <h2 className="text-2xl md:text-3xl text-gray-600 font-semibold"> بواسطة  
              <Link
                href={`/instructors/${course.instructor.id}`}
                className="text-2xl font-bold text-gray-900 hover:text-blue-700 transition-colors duration-300 line-clamp-2"
              >
                {course.instructor.name}
              </Link>
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed max-w-prose">
                {course.level || "لا يوجد وصف متاح لهذه الدورة."}
              </p>

              {/* Price Section */}
              <div className="flex items-center gap-6">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-900">${course.price}</h3>
                <span className="text-base text-gray-500 line-through">$ {(course.price * 1.2).toFixed(2)}</span>
                <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full animate-pulse">
                  خصم 20%
                </span>
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-8 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-4">
                  <Icon icon="solar:notebook-minimalistic-outline" className="text-blue-900 text-3xl" />
                  <span className="text-lg font-medium text-gray-800">{course.sessions_nbre} دروس</span>
                </div>
                <div className="flex items-center gap-4">
                  <Icon icon="solar:users-group-rounded-linear" className="text-blue-900 text-3xl" />
                  <span className="text-lg font-medium text-gray-800">{course.student_count} طالب</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <button
                      onClick={() => handlePurchase(course)}
                      className="bg-blue-900 text-white text-xl font-semibold px-10 py-4 rounded-xl hover:bg-blue-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">                      
                       سجل الآن في الدورة
                    </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Overview Section (Static) */}
      <div className="mt-16 bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-100 animate-fade-in">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">ما هي هذه الشهادة؟</h3>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
          هذه الشهادة هي برنامج تعليمي شامل يهدف إلى تزويدك بالمهارات الأساسية والمتقدمة في مجالك. من خلال منهج دراسي مدروس ومحتوى عملي، ستتمكن من إتقان المفاهيم الأساسية وتطبيقها بثقة في بيئة العمل.
        {course.description}
        </p>
      </div>

      {/* Certification Benefits Section (Static) */}
      <div className="mt-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-fade-in">فوائد الحصول على الشهادة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in delay-100">
            <Icon icon="solar:certificate-linear" className="text-blue-900 text-4xl mb-4" />
            <h4 className="text-xl font-semibold text-gray-800">مصداقية مهنية</h4>
            <p className="text-gray-600 mt-2">عزز ملفك المهني بشهادة معترف بها تثبت خبرتك.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in delay-200">
            <Icon icon="solar:star-linear" className="text-blue-900 text-4xl mb-4" />
            <h4 className="text-xl font-semibold text-gray-800">مهارات قابلة للتطبيق</h4>
            <p className="text-gray-600 mt-2">تعلم تقنيات وأدوات يمكن استخدامها فورًا في مشاريعك.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in delay-300">
            <Icon icon="solar:clock-circle-linear" className="text-blue-900 text-4xl mb-4" />
            <h4 className="text-xl font-semibold text-gray-800">تعلم مرن</h4>
            <p className="text-gray-600 mt-2">أكمل الشهادة وفقًا لجدولك الزمني مع وصول دائم.</p>
          </div>
        </div>
      </div>

      {/* Certification Requirements Section (Static) */}
      <div className="mt-16 bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 animate-fade-in">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">متطلبات الشهادة</h3>
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <Icon icon="solar:check-circle-linear" className="text-teal-600 text-2xl flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-gray-800">التسجيل</h4>
              <p className="text-gray-600">قم بالتسجيل في البرنامج باستخدام نموذج التسجيل عبر الإنترنت.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Icon icon="solar:check-circle-linear" className="text-teal-600 text-2xl flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-gray-800">إكمال المحتوى</h4>
              <p className="text-gray-600">أكمل جميع الوحدات التعليمية والتقييمات المطلوبة.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Icon icon="solar:check-circle-linear" className="text-teal-600 text-2xl flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-gray-800">تقديم المشروع النهائي</h4>
              <p className="text-gray-600">قدم مشروعًا نهائيًا أو اختبارًا لإثبات كفاءتك.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Process Section (Static) */}
      <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 border border-gray-100 animate-fade-in">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">خطوات الحصول على الشهادة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 animate-fade-in delay-100">
              <span className="text-xl font-bold">1</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-800">التسجيل</h4>
            <p className="text-Gray-600 mt-2">ابدأ رحلتك بالتسجيل في البرنامج عبر الإنترنت.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 animate-fade-in delay-200">
              <span className="text-xl font-bold">2</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-800">إكمال الدروس</h4>
            <p className="text-gray-600 mt-2">أكمل الوحدات التعليمية والتقييمات بنجاح.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 animate-fade-in delay-300">
              <span className="text-xl font-bold">3</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-800">استلام الشهادة</h4>
            <p className="text-gray-600 mt-2">احصل على شهادتك الرقمية فور الإكمال.</p>
          </div>
        </div>
      </div>

      {/* Why Choose This Certification Section (Static) */}
      <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-teal-50 rounded-3xl py-12 px-6 animate-fade-in">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">لماذا تختار هذه الشهادة؟</h3>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          هذه الشهادة هي بوابتك لتحقيق التميز المهني. مع منهج دراسي مصمم لتلبية متطلبات السوق، ستكتسب المهارات التي تجعلك متميزًا في مجالك. انضم الآن واستثمر في مستقبلك!
        </p>
        <button
          onClick={() => handlePurchase(course)}
          className="mt-6 bg-teal-600 text-white text-lg font-semibold px-8 py-3 rounded-xl hover:bg-teal-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">                      
          disabled={!course.price}
            ابدأ الآن
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsPage;