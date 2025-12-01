import React, { useEffect, useState } from "react";
import Inbox from "./partials/Inbox";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Sent from "./partials/Sent";
import Draft from "./partials/Draft";
import CreateQuery from "./partials/CreateQuery";
import { getQueries } from "@services/learner/QueryService";
import { useQueryStore } from "@app/store/learner/queryStore";
import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import ShowQuery from "./partials/ShowQuery";

const Mailbox: React.FC = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get('tab') || 'sent';

  const { queries, setQueries, loading, setLoading, error, setError } = useQueryStore();

  useEffect(() => {
    setError('');
    setLoading(true);
    getQueries().then((data) => {
      setQueries(data);
    }).catch((error) => {
      setError(error);
    }).finally(() => {
      setLoading(false);
    })
  }, [tab]);


  if (error) {
    return <Error error={error} />
  }

  return (
    <div className="flex flex-col h-[80vh] rounded-lg dark:bg-gray-900 bg-white bg-gray-100 dark:text-white text-gray-900">
      {/* Left Sidebar */}
      <div className="dark:bg-gray-800 bg-gray-200 p-4 flex justify-between items-center rounded-t-lg">
        <ul className="flex gap-1">
          {[
            { key: "sent", icon: "📤", label: "Sent" },
            { key: "drafts", icon: "📝", label: "Drafts" },
          ].map((item) => (
            <li key={item.key}>
              <Link to={`/help/mail-box?tab=${item.key}`} className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer dark:text-gray-300 text-gray-700 hover:dark:bg-gray-700 hover:bg-gray-300
                ${tab === item.key ? 'dark:bg-gray-700 bg-gray-300' : 'dark:bg-gray-800 bg-gray-200'}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to={`/help/mail-box?tab=new`}>
          <button
            className="bg-primary text-ac-dark py-2 px-4 rounded-lg mb-4 font-semibold"
          >
            Create A Query
          </button>
        </Link>
      </div>
      <div className="pb-5 flex-1 overflow-y-auto">
        {
          loading ? (
            <Loading loading={loading} />
          ) : (
            <>
              {tab === 'sent' && <Sent queries={queries} />}
              {tab === 'drafts' && <Draft queries={queries} />}
              {tab === 'new' && <CreateQuery />}
              {tab == 'show' && <ShowQuery />}
            </>
          )
        }
      </div>
    </div>
  );
};

export default Mailbox;
