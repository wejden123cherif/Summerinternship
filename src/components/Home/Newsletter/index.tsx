import Image from "next/image";

const Newsletter = () => {
    return (
        <section dir="rtl"> {/* Added dir="rtl" for overall Right-to-Left layout */}
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 md:grid-cols-12 xl:gap-x-8">
                    <div className="col-span-12 bg-newsletter-bg bg-contain bg-no-repeat rounded-xl py-20"> {/* Added rounded-xl and increased vertical padding for overall design */}
                        <div className="mb-10 mt-12 lg:mx-64 lg:my-12"> {/* Adjusted margins for better vertical flow */}
                            {/* Translated Headline */}
                            <h3 className="text-4xl md:text-5xl text-center font-semibold text-white mb-3">
                                الإبلاغ عن مشكلة.
                            </h3> {/* Arabic for "Report an Issue." */}
                            {/* Translated Sub-headline */}
                            <h3 className="text-base font-normal text-white/75 text-center mb-8">
                                إذا واجهت أي مشاكل أو لديك اقتراحات، يرجى ملء النموذج أدناه.
                            </h3> {/* Arabic for "If you encounter any problems or have suggestions, please fill out the form below." */}

                            {/* Form for Issues/Problems */}
                            <form className="space-y-5 px-4 md:px-0"> {/* Adjusted vertical spacing, added horizontal padding for smaller screens */}
                                {/* Email Input Field */}
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        className="py-3 lg:py-4 text-sm md:text-base w-full px-5 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder-gray-500" // Reduced padding, text size, changed rounded-full to rounded-lg, added focus ring
                                        placeholder="أدخل بريدك الإلكتروني" // Arabic for "Enter your email address"
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                {/* Subject Input Field */}
                                <div>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="py-3 lg:py-4 text-sm md:text-base w-full px-5 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder-gray-500" // Reduced padding, text size, changed rounded-full to rounded-lg, added focus ring
                                        placeholder="الموضوع" // Arabic for "Subject"
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                {/* Message Textarea Field */}
                                <div>
                                    <textarea
                                        name="message"
                                        //rows="5" // Keep rows for message content
                                        className="py-3 lg:py-4 text-sm md:text-base w-full px-5 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-right placeholder-gray-500" // Reduced padding, text size, added focus ring
                                        placeholder="صف مشكلتك أو اقتراحك هنا..." // Arabic for "Describe your problem or suggestion here..."
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center pt-2"> {/* Added some top padding */}
                                    <button
                                        type="submit"
                                        className="px-6 py-3 focus:outline-none focus:shadow-outline bg-ultramarine hover:bg-midnightblue duration-150 ease-in-out rounded-full text-white text-md font-semibold transition-colors" // Adjusted padding, text size, added transition
                                    >
                                        إرسال {/* Arabic for "Send" */}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Newsletter;