// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Icon } from "@iconify/react";

// interface Course {
//   id: number;
//   image_url: string;
//   instructor: string;
//   price: number;
//   sessions_nbre: number;
//   student_count: number;
//   title: string;
//   description: string;
// }

// interface CourseDetailsClientProps {
//   courseId: string;
//   initialCourse?: Course; // Optional initial course data
// }

// const CourseDetailsClient = ({ courseId, initialCourse }: CourseDetailsClientProps) => {
//   const [courseData, setCourse] = useState<Course[]>(initialCourse ? [initialCourse] : []);

//   useEffect(() => {
//     if (!initialCourse) {
//       fetch(`http://${process.env.BACKEND_URL}:5000/get_certification/${courseId}`)
//         .then((response) => response.json())
//         .then((data: Course[]) => setCourse(data))
//         .catch((error) => console.error("Error fetching course data:", error));
//     }
//   }, [courseId, initialCourse]);

//   const course = courseData.find((c) => c.id === parseInt(courseId));

//   if (!course) {
//     return (
//       <div className="container mx-auto px-4 pt-24 pb-12 text-center" dir="rtl">
//         <h1 className="text-4xl font-bold text-red-600">عذرًا، لم يتم العثور على الدورة المطلوبة.</h1>
//         <p className="mt-4 text-lg text-gray-700">الرجاء التحقق من الرابط والمحاولة مرة أخرى.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-28 pb-12" dir="rtl">
//       <div className="bg-white rounded-2xl shadow-lg p-8">
//         <div className="flex flex-col md:flex-row md:items-start gap-8">
//           {/* Course Image */}
//           <div className="w-full md:w-1/2 flex-shrink-0">
//             <Image
//               src={course.image_url}
//               alt={course.title}
//               width={600}
//               height={400}
//               className="rounded-xl object-cover w-full h-auto"
//             />
//           </div>

//           {/* Course Details */}
//           <div className="w-full md:w-1/2">
//             <h1 className="text-5xl font-bold text-midnight_text mb-4">{course.title}</h1>
//             <h2 className="text-2xl text-gray-700 mb-6">{course.instructor}</h2>

//             <p className="text-gray-800 text-lg leading-relaxed mb-8">
//               {course.description || "لا يوجد وصف متاح لهذه الدورة."}
//             </p>

//             <h3 className="text-4xl font-bold text-primary mb-6">${course.price}</h3>

//             <div className="flex flex-wrap gap-8 justify-start items-center border-t border-b py-6 mb-8">
//               <div className="flex items-center gap-3">
//                 <Icon icon="solar:notebook-minimalistic-outline" className="text-primary text-2xl" />
//                 <span className="text-lg font-medium text-black/75">{course.sessions_nbre} دروس</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Icon icon="solar:users-group-rounded-linear" className="text-primary text-2xl" />
//                 <span className="text-lg font-medium text-black/75">{course.student_count} طالب</span>
//               </div>
//             </div>

//             <button className="bg-primary text-white text-xl font-semibold px-8 py-4 rounded-lg hover:bg-opacity-90 transition duration-300">
//               سجل الآن في الدورة
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetailsClient;