import React from "react";
import { useForm } from "react-hook-form";

const UserForm: React.FC = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title */}
          <div className="col-span-2">
            <label className="block text-sm font-medium">Title *</label>
            <input
              {...register("title")}
              type="text"
              placeholder="Mr./Mrs./Miss./Others"
              className="w-full mt-1 p-2 border border-gray-700 py-3rounded"
            />
          </div>

          {/* Name Fields */}
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter name as to be printed on certificate"
              className="w-full mt-1 p-2 border border-gray-700 py-3 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Middle Name</label>
            <input
              {...register("middleName")}
              type="text"
              placeholder="Enter middle name"
              className="w-full mt-1 p-2 border border-gray-700 py-3 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name *</label>
            <input
              {...register("lastName")}
              type="text"
              placeholder="Enter last name"
              className="w-full mt-1 p-2 border border-gray-700 py-3 rounded"
            />
          </div>

          {/* Email Fields */}
          <div>
            <label className="block text-sm font-medium">Registered Email *</label>
            <input
              {...register("registeredEmail")}
              type="email"
              placeholder="Enter your registered email id"
              className="w-full mt-1 p-2 border border-gray-700 py-3 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Alternate Email</label>
            <input
              {...register("alternateEmail")}
              type="email"
              placeholder="Alternate Email"
              className="w-full mt-1 p-2 border border-gray-700 py-3 rounded"
            />
          </div>

          {/* Mobile Fields */}
          <div>
            <label className="block text-sm font-medium">Registered Mobile *</label>
            <input
              {...register("registeredMobile")}
              type="tel"
              placeholder="Enter your registered 10 digit mobile number"
              className="w-full mt-1 p-2 border border-gray-700 py-3 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Alternate Mobile</label>
            <input
              {...register("alternateMobile")}
              type="tel"
              placeholder="Enter your alternate 10 digit mobile number"
              className="w-full mt-1 p-2 border border-gray-700 py-3 rounded"
            />
          </div>

          {/* Contact Codes */}
          <div>
            <label className="block text-sm font-medium">Country Code</label>
            <input
              {...register("countryCode")}
              type="text"
              placeholder="Country Code"
              className="w-full mt-1 p-2 border border-gray-700 py-3 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Area Code</label>
            <input
              {...register("areaCode")}
              type="text"
              placeholder="Area Code"
              className="w-full mt-1 p-2 border border-gray-700 py-3 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Landline Phone</label>
            <input
              {...register("landlinePhone")}
              type="tel"
              placeholder="Landline Phone"
              className="w-full mt-1 p-2 border border-gray-700 py-3 rounded"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
