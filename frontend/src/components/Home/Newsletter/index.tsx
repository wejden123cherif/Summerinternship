"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';

const Newsletter = () => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, subject, message }),
            });

            if (response.ok) {
                alert("تم الإرسال بنجاح!");
                setEmail("");
                setSubject("");
                setMessage("");
            } else {
                alert("حدث خطأ، يرجى المحاولة لاحقًا.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("فشل الاتصال بالخادم. تأكد أن السيرفر يعمل.");
        }
    };
    return (
        <section id='newsletter' dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="scroll-mt-16"> {/* Added dir="rtl" for Right-to-Left layout */}
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 md:grid-cols-12 xl:gap-x-8">
                    {/* Blue Background Container */}
                    <div className="col-span-12 bg-newsletter-bg bg-cover bg-center bg-no-repeat rounded-xl">
                        {/* Internal padding wrapper */}
                        <div className="py-20 pb-0 mb-10 mt-12 lg:mx-64 lg:my-12">
                            {/* Headline */}
                            <h3 className="text-4xl md:text-5xl text-center font-semibold text-white mb-3">
                                {t('newsletter.title')}
                            </h3>

                            {/* Sub-headline */}
                            <h3 className="text-base font-normal text-white/75 text-center mb-8">
                                {t('newsletter.subtitle')}
                            </h3>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 md:space-y-5 px-2 md:px-0 max-w-xl mx-auto"
                            >
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`py-3 lg:py-4 text-sm md:text-base w-full px-5 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${i18n.language === 'ar' ? 'text-right' : 'text-left'} placeholder-gray-500`}
                                        placeholder={t('newsletter.emailPlaceholder')}
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className={`py-3 lg:py-4 text-sm md:text-base w-full px-5 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${i18n.language === 'ar' ? 'text-right' : 'text-left'} placeholder-gray-500`}
                                        placeholder={t('newsletter.subjectPlaceholder')}
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                {/* Message Textarea */}
                                <div>
                                    <textarea
                                        name="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className={`py-3 lg:py-4 text-sm md:text-base w-full px-5 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${i18n.language === 'ar' ? 'text-right' : 'text-left'} placeholder-gray-500`}
                                        placeholder={t('newsletter.messagePlaceholder')}
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center pt-2">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 focus:outline-none focus:shadow-outline bg-ultramarine hover:bg-midnightblue duration-150 ease-in-out rounded-full text-white text-md font-semibold transition-colors"
                                    >
                                        {t('newsletter.submitButton')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
