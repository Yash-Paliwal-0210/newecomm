import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="px-6 py-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Shipping Policy
      </h1>
      <p className="text-gray-600 mb-6">
        At BR Collection, we strive to ensure that your order reaches you as quickly and safely as possible. Please read our shipping policy carefully to understand the terms and timelines associated with our shipping process.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Shipping Locations</h2>
        <p className="text-gray-600">
          We currently ship within India. International shipping options will be available soon. Stay tuned for updates!
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Shipping Timelines</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Orders are typically processed within 1-2 business days.</li>
          <li>Delivery time varies by location: <strong>3-7 business days</strong> for most cities.</li>
          <li>Remote areas may require additional time for delivery.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Shipping Charges</h2>
        <p className="text-gray-600">
          Shipping charges are calculated at checkout based on your location and the weight of your order.
        </p>
      </section>

      {/* <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Order Tracking</h2>
        <p className="text-gray-600">
          Once your order is shipped, you will receive an email with a tracking number. You can use this number to track your order on our website.
        </p>
      </section> */}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Delivery Issues</h2>
        <p className="text-gray-600">
          If your package is delayed, lost, or arrives damaged, please contact our support team at <strong>support@brcollection.com</strong> . We are here to assist you!
        </p>
      </section>
    </div>
  );
};

export default ShippingPolicy;
