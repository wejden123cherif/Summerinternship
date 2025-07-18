'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';

interface Certification {
  id: number;
  title: string;
  description: string;
  price: number;
  sessions_nbre: number;
  image_url: string | null;
  level: string;
  student_count: number;
  instructor_id: number;
  instructor?: {
    id: number;
    name: string;
    bio: string | null;
    specialization: string;
    email: string | null;
  };
}

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://${process.env.BACKEND_URL}:5000/get_certifications`);
        if (!response.ok) {
          throw new Error(`خطأ HTTP! الحالة: ${response.status}`);
        }
        const data: Certification[] = await response.json();
        console.log('بيانات الشهادات المستردة:', data);
        setCertifications(data);
        setFilteredCertifications(data);
        setError(null);
      } catch (error) {
        console.error('خطأ في جلب بيانات الشهادات:', error);
        setError('فشل في تحميل بيانات الشهادات. يرجى المحاولة مرة أخرى لاحقًا.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  useEffect(() => {
    const filtered = certifications.filter((cert) =>
      cert.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCertifications(filtered);
  }, [searchQuery, certifications]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100" dir="rtl">
        <div className="text-base sm:text-lg font-medium text-gray-600 animate-pulse">
          جارٍ التحميل...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100" dir="rtl">
        <div className="text-base sm:text-lg font-medium text-red-600 bg-red-100 p-3 sm:p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-28 sm:pt-32 md:pt-40 max-w-xs sm:max-w-md md:max-w-3xl lg:max-w-6xl" dir="rtl">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-8 text-center">
        جميع الدورات التدريبية
      </h1>

      <div className="mb-6 sm:mb-8">
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="ابحث عن دورة..."
            className="w-full p-3 sm:p-4 text-sm sm:text-base text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Icon
            icon="mdi:magnify"
            className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg sm:text-xl"
          />
        </div>
      </div>

      {filteredCertifications.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCertifications.map((cert) => (
            <li
              key={cert.id}
              className="bg-white p-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 w-full max-w-md mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={cert.image_url || 'https://via.placeholder.com/370x262'}
                  alt={cert.title}
                  width={370}
                  height={262}
                  className="object-cover w-full h-[262px] rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="pt-6 space-y-4">
                <Link
                  href={`/courses/${cert.id}`}
                  className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-700 transition-colors duration-300 line-clamp-2"
                >
                  {cert.title}
                </Link>
                <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
                  {cert.description || 'لا يوجد وصف متاح.'}
                </p>
                <h3 className="text-base sm:text-lg font-medium text-gray-600">{cert.instructor?.name || 'غير محدد'}</h3>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-700">${cert.price.toFixed(2)}</span>
                  <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                    {cert.instructor?.name || 'غير محدد'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:notebook-minimalistic-outline" className="text-blue-700 text-xl" />
                    <span className="text-sm font-medium text-gray-700">{cert.sessions_nbre || 'غير محدد'} دروس</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:users-group-rounded-linear" className="text-blue-700 text-xl" />
                    <span className="text-sm font-medium text-gray-700">{cert.student_count || '0'} طالب</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:star-linear" className="text-blue-700 text-xl" />
                    <span className="text-sm font-medium text-gray-700">{cert.level || 'غير محدد'}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 italic text-sm sm:text-base text-center">
          لا توجد شهادات تطابق البحث.
        </p>
      )}
    </div>
  );
};

export default CertificationsPage;