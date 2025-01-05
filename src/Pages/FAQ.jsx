import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 10-day return policy from the date of delivery. Items must be in their original condition and packaging. Please refer to our Return Policy page for more details.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Shipping typically takes 2-7 business days, depending on your location. We’ll send you tracking details once your order is shipped.",
    },
    // {
    //   question: "Do you offer free shipping?",
    //   answer:
    //     "Yes, we offer free shipping on orders above ₹999. For orders below this amount, a standard shipping fee applies.",
    // },
    // {
    //   question: "How can I track my order?",
    //   answer:
    //     "Once your order is shipped, you will receive an email with the tracking number and a link to track your package.",
    // },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI, Net Banking, and Wallet payments. Cash on Delivery (COD) is also available for select locations.",
    },
    {
      question: "Can I cancel or modify my order?",
      answer:
        "Orders can be canceled or modified within 24 hours of placing them. After this, cancellation requests may not be possible. Please contact our support team for assistance.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we only ship within India. International shipping will be available soon. Stay tuned for updates!",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach us at brcollection333@gmail.com or call us at +91-7488244470. Our customer support team is available Tuesday to Sunday, 10:00 AM to 6:00 PM.Monday will be off.",
    },
  ];

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Frequently Asked Questions (FAQ)
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Have a question? Check out our most commonly asked questions below. If you still need help, feel free to contact us!
      </p>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-300 pb-4"
          >
            <h3 className="text-lg font-semibold text-gray-700">
              {index + 1}. {faq.question}
            </h3>
            <p className="text-gray-600 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
