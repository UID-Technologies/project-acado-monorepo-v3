import { useState, useEffect, type FormEvent } from "react";
import { useBrochureLeadStore } from "@app/store/public/BrochureLeadStore";
import { fetchBrochure } from "@services/public/BrochureLeadService";
import { enqueueSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";


export default function LeadCaptureForm() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [isOpen, setIsOpen] = useState(queryParams.get("isOpen") === "true");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setBrochureLead, setError, setLoading } = useBrochureLeadStore();


  useEffect(() => {
    if (queryParams.get("isOpen") === "true") {
      setIsOpen(true);
    }
  }, [location.search]);


  const getBrochureLead = async (formData: FormData) => {
    try {
      setLoading(true);


      const leadData = {
        name: formData.get("name"),
        email: formData.get("email"),
        mobile: formData.get("mobile"),
        education: formData.get("education"),
        university: formData.get("university"),
        university_sort_name: formData.get("university_sort_name"),
      };

      const brochureLeadData = await fetchBrochure(leadData);
      setBrochureLead(brochureLeadData);
      enqueueSnackbar("Lead saved successfully", { variant: "success" });
      console.log("fetch brochure lead", brochureLeadData);
    } catch (error: unknown) {
      setError("Failed to load brochure lead");
      enqueueSnackbar('Failed to load brochure lead', { variant: "error" });


    } finally {
      setLoading(false);
    }
  };


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await getBrochureLead(formData);


      setIsOpen(false);


      e.currentTarget.reset();
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }


  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-primary">Download Brochure</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-4 dark:text-gray-200">Please fill in your details to download the brochure.</p>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    required
                    pattern="[0-9]{10}"
                    placeholder="Mobile number"
                    className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="education" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    required
                    placeholder="Highest Qualification"
                    className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="university" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    required
                    placeholder="University Name"
                    className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="university_sort_name" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                    University Short Name
                  </label>
                  <input
                    type="text"
                    id="university_sort_name"
                    name="university_sort_name"
                    required
                    placeholder="University"
                    className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 text-white bg-primary dark:bg-primary rounded-md hover:dark:bg-primary focus:outline-none focus:ring-2 focus:dark:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>

              {message && <div className="mt-4 p-3 bg-blue-50 text-primary rounded-md">{message}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
