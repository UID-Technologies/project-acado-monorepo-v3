import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "@/components/ui/Button";

const ZoomClassPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const zoomClassUrl = location.state?.zoomClass;

    const handleMissingUrl = () => {
        if (!zoomClassUrl?.zoom_url) {
            alert("Zoom meeting URL is missing. Redirecting to the previous page.");
            navigate(-1); 
        }
    };

    React.useEffect(() => {
        handleMissingUrl();
    }, []);

    return (
        <div>
           
            {zoomClassUrl?.zoom_url ? (
                <a href={zoomClassUrl.zoom_url} target="_blank" rel="noopener noreferrer">
                    <Button>Open Zoom Meeting</Button>
                </a>
            ) : (
                <p>Please contact your administrator for the meeting link.</p>
            )}
        </div>
    );
}

export default ZoomClassPage;
