import Image from "next/image";

const Newsletter = () => {
    return (
        <section id='newsletter' dir="rtl"> {/* Added dir="rtl" for Right-to-Left layout */}
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 md:grid-cols-12 xl:gap-x-8">
                    {/* Blue Background Container */}
                    <div className="col-span-12 bg-newsletter-bg bg-cover bg-center bg-no-repeat rounded-xl">
                        {/* Internal padding wrapper */}
                        <div className="py-20 pb-0 mb-10 mt-12 lg:mx-64 lg:my-12">
                            {/* Headline */}
                            <h3 className="text-4xl md:text-5xl text-center font-semibold text-white mb-3">
                                الإبلاغ عن مشكلة.
                            </h3>

                            {/* Sub-headline */}
                            <h3 className="text-base font-normal text-white/75 text-center mb-8">
                                إذا واجهت أي مشاكل أو لديك اقتراحات، يرجى ملء النموذج أدناه.
                            </h3>

                            {/* Form */}
                            <form className="space-y-5 px-4 md:px-0">
                                {/* Email Input */}
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        className="py-3 lg:py-4 text-sm md:text-base w-full px-5 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder-gray-500"
                                        placeholder="أدخل بريدك الإلكتروني"
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                {/* Subject Input */}
                                <div>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="py-3 lg:py-4 text-sm md:text-base w-full px-5 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder-gray-500"
                                        placeholder="الموضوع"
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                {/* Message Textarea */}
                                <div>
                                    <textarea
                                        name="message"
                                        className="py-3 lg:py-4 text-sm md:text-base w-full px-5 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-right placeholder-gray-500"
                                        placeholder="صف مشكلتك أو اقتراحك هنا..."
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center pt-2">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 focus:outline-none focus:shadow-outline bg-ultramarine hover:bg-midnightblue duration-150 ease-in-out rounded-full text-white text-md font-semibold transition-colors"
                                    >
                                        إرسال
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
