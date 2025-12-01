import React from "react";

const CustomerSupport: React.FC = () => {
  return (
    <div className="flex flex-col font-sans min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <header className="bg-gray-200 dark:bg-gray-800 p-5 border-b border-gray-300 dark:border-gray-700 sticky top-0 rounded-t-lg">
        <div className="flex justify-between items-center text-lg font-semibold text-gray-700 dark:text-gray-200">
          {/* <span>Support Number: 9754357976, 8854457876</span> */}
          <span>Know my portal: <a href="https://help.acado.ai/" className="text-blue-600 dark:text-blue-400 underline">https://help.acado.ai/</a></span>
        </div>
      </header>

      {/* Title Section */}
      <div className="bg-gray-300 dark:bg-gray-700 p-6 text-center border-b border-gray-400 dark:border-gray-600">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Customer Support</h1>
      </div>

      {/* Content Section */}
      <section className="p-6">
        <table className="table-auto w-full border-collapse border border-gray-400 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-left">S.No</th>
              <th className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-left">Query Type</th>
              <th className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-left">Contact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">1</td>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">Support1 </td>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">938467553</td>
            </tr>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">2</td>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">Support2</td>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">987345768</td>
            </tr>
            <tr>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">3</td>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">Support3</td>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">982578396</td>
            </tr>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">4</td>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">Support4</td>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">882578366</td>
            </tr>
          </tbody>
        </table>
      </section>
      <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-2xl font-semibold text-red-600 mb-4 dark:text-primary">Contact Us</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-semibold">Acado.ai</p>
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="font-semibold text-lg">Postal Address:</h1>
              <div className="space-y-1">
                <p>University of Vaasa/ Smart Edu Bridge</p>
                <p>P.O Box 70065101 Vaasa, Finland</p>
              </div>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Visiting Address:</h1>
              <div className="space-y-1">
                <p>University of Vaasa</p>
                <p>Yliopistoranta 10, Fabriikki Building, 65200 Vaasa, Finland</p>
              </div>
            </div>
          </div>
          <div className="space-y-1 mt-4">
            <p className="flex items-center space-x-2">
              <span className="font-semibold">Email:</span>
              <a
                href="mailto:connect@acado.ai"
                className="text-red-600 hover:underline"
                aria-label="Send email to connect@acado.ai"
              >
                connect@acado.ai
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <span className="font-semibold">Alternative Email:</span>
              <a
                href="mailto:connect@edulystventures.com"
                className="text-red-600 hover:underline"
                aria-label="Send email to connect@edulystventures.com"
              >
                connect@edulystventures.com
              </a>
            </p>
          </div>
        </div>
      </div>

    </div >
  );
};

export default CustomerSupport;
