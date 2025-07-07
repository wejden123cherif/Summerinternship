"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { loadStripe } from "@stripe/stripe-js";

interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  instructor: string;
  price: number;
  sessions_nbre: number;
  student_count: number;
}

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

const Courses: React.FC = () => {
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
      { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1, infinite: true, dots: false } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, infinite: true, dots: false } },
    ],
  };

  const [courseData, setCourseData] = useState<Course[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NODE_ENV === "production"
      ? "https://www.smartovateai.com/get_bestsellers"
      : "http://localhost:5000/get_bestsellers";
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch bestsellers: ${response.status}`);
        return response.json();
      })
      .then((data) => setCourseData(data))
      .catch((error) => console.error("Error fetching course data:", error));
  }, []);

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
        ? "https://www.smartovateai.com/api/create-checkout-session"
        : "http://localhost:5000/api/create-checkout-session";
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
    <section id="courses" dir="rtl">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="sm:flex justify-between items-center mb-20">
          <h2 className="text-midnight_text text-4xl lg:text-5xl font-semibold mb-5 sm:mb-0">
            الدورات الأكثر شهرة
          </h2>
          <Link href="/" className="text-primary text-lg font-medium hover:tracking-widest duration-500">
            استكشف الدورات
          </Link>
        </div>
        <Slider {...settings}>
          {courseData.map((course, i) => (
            <div key={i}>
              <div className="bg-white m-3 mb-12 px-3 pt-3 pb-12 shadow-course-shadow rounded-2xl h-full">
                <div className="relative rounded-3xl" style={{ width: "370px", height: "262px" }}>
                  <Image
                    src={course.image_url || "/fallback-image.png"}
                    alt={course.title}
                    width={389}
                    height={262}
                    className="m-auto clipPath"
                    style={{ borderRadius: "12px", width: "100%", height: "100%" }}
                  />
                  <div className="absolute right-5 -bottom-2 bg-secondary rounded-full p-6">
                    <h3 className="text-white uppercase text-center text-sm font-medium">
                      الأكثر<br />مبيعًا
                    </h3>
                  </div>
                </div>
                <div className="px-3 pt-6">
                  <Link href="#" className="text-2xl font-bold text-black max-w-[75%] inline-block">
                    {course.title}
                  </Link>
                  <p className="text-base font-normal pt-2 text-black/75">{course.description || "لا يوجد وصف متاح"}</p>
                  <h3 className="text-base font-normal pt-2 text-black/75">{course.instructor}</h3>
                  <div className="flex justify-between items-center py-6 border-b">
                    <h3 className="text-3xl font-medium">${course.price || "N/A"}</h3>
                  </div>
                  <div className="flex justify-between pt-6">
                    <div className="flex gap-4">
                      <Icon
                        icon="solar:notebook-minimalistic-outline"
                        className="text-primary text-xl inline-block me-2"
                      />
                      <h3 className="text-base font-medium text-black opacity-75">{course.sessions_nbre} دروس</h3>
                    </div>
                    <div className="flex gap-4">
                      <Icon
                        icon="solar:users-group-rounded-linear"
                        className="text-primary text-xl inline-block me-2"
                      />
                      <h3 className="text-base font-medium text-black opacity-75">{course.student_count} طالب</h3>
                    </div>
                  </div>
                  <div className="pt-6">
                    <button
                      onClick={() => handlePurchase(course)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full text-center block"
                      disabled={!course.price}
                    >
                      احجز الآن
                    </button>
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

export default Courses;