import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="px-6 py-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Privacy Policy
      </h1>
      <p className="text-gray-600 mb-6">
        At BR Collection, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Personal information: Name, email address, phone number, and shipping address.</li>
          <li>Payment details: Credit/debit card information (processed securely).</li>
          <li>Usage data: Information about your interaction with our website.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>To process and fulfill your orders.</li>
          <li>To send order updates and promotional emails.</li>
          <li>To improve our website and customer experience.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Data Security</h2>
        <p className="text-gray-600">
          We use secure servers and encryption to protect your data. Your payment information is processed through trusted payment gateways and is never stored on our servers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Cookies</h2>
        <p className="text-gray-600">
          Our website uses cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, but this may affect the functionality of our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Third-Party Services</h2>
        <p className="text-gray-600">
          We may share your data with third-party service providers to fulfill your orders or improve our services. These providers are bound by confidentiality agreements.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Rights</h2>
        <p className="text-gray-600">
          You have the right to access, update, or delete your personal information. Please contact us at <strong>brcollection333@gmail.com</strong> to exercise your rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions about our privacy practices, please reach out to us at:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Email: <strong>brcollection333@gmail.com</strong></li>
          <li>Phone: <strong>+91-7488244470</strong></li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
