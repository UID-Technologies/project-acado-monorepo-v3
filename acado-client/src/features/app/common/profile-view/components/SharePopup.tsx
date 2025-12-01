import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/ShadcnButton';
import Download from './icons/download.svg';
import Whatsapp from './icons/whatsapp.svg';
import Sms from './icons/sms.svg';
import Instagram from './icons/instagram.svg';
import Email from './icons/email.svg';
import link from './icons/link.svg';

interface SharePopupProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string; // 👈 Accept URL as prop
}

const SharePopup: React.FC<SharePopupProps> = ({ open, onClose, shareUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const message = encodeURIComponent(`Here is the link to my online portfolio: ${shareUrl}`);

  useEffect(() => {
    if (canvasRef.current && open) {
      QRCode.toCanvas(canvasRef.current, shareUrl, { width: 200 });
    }
  }, [open, shareUrl]);

  const shareToWhatsApp = () => window.open(`https://wa.me/?text=${message}`, '_blank');
  const shareToSMS = () => window.open(`sms:?body=${message}`, '_blank');
  const shareToInstagram = () => window.open('https://www.instagram.com/', '_blank');
  const shareToEmail = () => (window.location.href = `mailto:?subject=Check this out&body=${message}`);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied!');
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const downloadQR = async () => {
    if (canvasRef.current) {
      await QRCode.toCanvas(canvasRef.current, shareUrl);
      const link = document.createElement('a');
      link.download = 'share-qr.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative">
        
        <div className='flex items-center border-b border-gray-200 shadow p-4 px-6 justify-between'>

        <h2 className="text-xl font-semibold">Share Your Profile</h2>
        <button
          className="text-gray-400 hover:bg-gray-100 p-1 px-3 transition duration-150 rounded-full text-lg hover:text-gray-600"
          onClick={onClose}
        >
          ✕
        </button>
        </div>

        <div className='p-4'>

        {/* QR Code */}
        <div className="flex justify-center">
          <canvas ref={canvasRef} />
        </div>

        <a href={shareUrl} className='flex justify-center hover:underline text-blue-600'>{shareUrl}</a>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-3 mb-4 mt-4 justify-center">
          <Button variant={'outline'} onClick={shareToWhatsApp} >
            <img src={Whatsapp} alt="WhatsApp" className="w-5 h-5 text-white" />
          </Button>

          <Button variant={'outline'} onClick={shareToSMS}>
            <img src={Sms} alt="SMS" className="w-5 h-5 text-white" />
          </Button>

          <Button variant={'outline'} onClick={shareToInstagram}>
            <img src={Instagram} alt="Instagram" className="w-5 h-5 text-white" />
          </Button>

          <Button variant={'outline'} onClick={shareToEmail}>
            <img src={Email} alt="Email" className="w-5 h-5 text-white" />
          </Button>

          <Button variant={'outline'} onClick={copyToClipboard}>
            <img src={link} alt="Copy" className="w-5 h-5 text-white" />
          </Button>

          <Button variant={'outline'} onClick={downloadQR}>
            <img src={Download} alt="Download QR" className="w-5 h-5 text-white" />
          </Button>
        </div>
        </div>

      </div>
    </div>
  );
};

export default SharePopup;
