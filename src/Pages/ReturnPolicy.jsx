import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="px-6 py-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Return and Refund Policy
      </h1>
      <p className="text-gray-600 mb-6">
        Thank you for shopping with BR Collection! We value your satisfaction and strive to provide the best shopping experience. If you are not entirely satisfied with your purchase, we're here to help.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Returns</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>You have 10 calendar days to return an item from the date you received it.</li>
          <li>To be eligible for a return, your item must be unused, in the same condition that you received it, and in the original packaging.</li>
          <li>You will also need to provide a receipt or proof of purchase.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Non-Returnable Items</h2>
        <p className="text-gray-600">The following items cannot be returned:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Items on sale or purchased with a discount.</li>
          <li>Personalized or custom-made products.</li>
          <li>Opened or used products such as cosmetics, jewelry, or undergarments.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Refunds</h2>
        <p className="text-gray-600">
          Once we receive your item, we will inspect it and notify you of the status of your refund. If your return is approved, we will initiate a refund to your original method of payment.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
          <li>Refunds will typically be processed within 7-10 working days.</li>
          <li>Depending on your payment provider, it may take additional time for the amount to reflect in your account.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Shipping Costs</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Shipping costs for returning items are non-refundable.</li>
          <li>If your return is approved, the cost of return shipping will be deducted from your refund (if applicable).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">How to Return an Item</h2>
        <p className="text-gray-600 mb-4">To initiate a return, please follow these steps:</p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Email us at <span className="font-medium text-gray-700">brcollection333@gmail.com</span> with your order details.</li>
          <li>Pack the item securely in its original packaging.</li>
          <li>Send the item to the following address:</li>
        </ol>
        <address className="mt-4 text-gray-600 italic">
          BR Collection Returns Department <br />
          23/3D/1A gali no 1 East Azad Nagar <br />
          Delhi, 110051, India
        </address>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-4">
          If you have any questions about our return and refund policy, please contact us at:
        </p>
        <ul className="space-y-2 text-gray-600">
          <li>Email: <span className="font-medium text-gray-700">brcollection333@gmail.com</span></li>
          <li>Phone: <span className="font-medium text-gray-700">+91-7488244470</span></li>
        </ul>
      </section>
    </div>
  );
};

export default ReturnPolicy;
