import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ApplyNowButton({ course_id, course, inputValue }: any) {
    // alert(course_id)
  const [formId, setFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // const response = await axios.get(
        //   `http://57.159.29.149:4000/forms/by-course/${course_id}`
        // );

        // if (response.data?.formId) {
        //   setFormId(response.data.formId);
        // } else {
        //   setFormId(null);
        // }
        setFormId('68fea24ee95f59ee6b286d8a');
        // setFormId(null);
      } catch (error) {
        console.error('Error fetching form:', error);
        setFormId(null);
      } finally {
        setLoading(false);
      }
    };

    if (course_id) {
      fetchForm();
    }
  }, [course_id]);

  if (loading) return null;

  if (!formId) return null;

  const handleApplyNow = () => {
    // const mockLearnerAuthData = {
    //   email: 'learner@example.com',
    //   role: 'user',
    //   name: 'John Doe',
    //   userId: 'user123',
    // };

    // // Encode auth data for URL
    // const encodedAuth = encodeURIComponent(
    //   btoa(JSON.stringify(mockLearnerAuthData))
    // );

    function encodeAuthData(authData) {
        // Encode the authentication data as base64
        const jsonString = JSON.stringify(authData);
        return btoa(encodeURIComponent(jsonString));
    }

    const userData = localStorage.getItem('sessionUser');
    const userDataParsed = JSON.parse(userData);
    // alert(userDataParsed.state.user.name)
    // return false;
    const mockLearnerAuthData = {
        email: userDataParsed.state.user.email,
        role: userDataParsed.state.user.role,
        name: userDataParsed.state.user.name,
        userId: userDataParsed.state.user.id
    };
    const encodedAuth = encodeAuthData(mockLearnerAuthData);

    const url = `http://57.159.29.149:8080/user/login?formId=${formId}&auth=${encodedAuth}`;

    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleApplyNow}
      className="text-nowrap bg-primary text-white dark:text-gray-900 font-bold py-2 px-6 rounded hover:bg-primary-light dark:hover:bg-primary-dark transition"
    >
      Apply Now
    </button>
  );
}
