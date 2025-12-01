import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { Eye, Download } from "lucide-react";

interface Certificate {
  id: string;
  recipientName: string;
  program: string;
  date: string;
  imageUrl: string;
  mayor: string;
  president: string;
}

const certificates: Certificate[] = [
  {
    id: "cert1",
    recipientName: "Christopher Sullivan",
    program: "Chicago Community Outreach Program",
    date: "March 15th, 2023",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-20%20at%204.45.46%20PM-dvzVRZxuAyfmtFCLaMg7UWvkv0EjqU.png",
    mayor: "Miranda Grayson",
    president: "Anthony Berkins",
  },
  {
    id: "cert2",
    recipientName: "Emma Johnson",
    program: "Chicago Community Outreach Program",
    date: "April 20th, 2023",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-20%20at%204.45.46%20PM-dvzVRZxuAyfmtFCLaMg7UWvkv0EjqU.png",
    mayor: "Miranda Grayson",
    president: "Anthony Berkins",
  },
  {
    id: "cert3",
    recipientName: "Michael Chen",
    program: "Chicago Community Outreach Program",
    date: "May 5th, 2023",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-20%20at%204.45.46%20PM-dvzVRZxuAyfmtFCLaMg7UWvkv0EjqU.png",
    mayor: "Miranda Grayson",
    president: "Anthony Berkins",
  },
  {
    id: "cert4",
    recipientName: "Sarah Williams",
    program: "Chicago Community Outreach Program",
    date: "June 10th, 2023",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-20%20at%204.45.46%20PM-dvzVRZxuAyfmtFCLaMg7UWvkv0EjqU.png",
    mayor: "Miranda Grayson",
    president: "Anthony Berkins",
  },
];

export default function VolunteerCertificates() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const handleView = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleDownload = (certificate: Certificate) => {
    const link = document.createElement("a");
    link.href = certificate.imageUrl;
    link.download = `${certificate.recipientName.replace(" ", "_")}_Certificate.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
     
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4 dark:text-primary text-primary">Volunteer Certificates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="border rounded-lg overflow-hidden p-4">
            <div className="aspect-[4/3] relative mb-4">
              <img
                src={certificate.imageUrl || "/placeholder.svg"}
                alt={`Certificate for ${certificate.recipientName}`}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <h3 className="font-semibold mb-2 truncate">{certificate.recipientName}</h3>
            <p className="text-sm text-muted-foreground mb-4">{certificate.date}</p>
            <div className="flex items-center gap-8">
              <Button onClick={() => handleView(certificate)} className="flex items-center">
                <Eye className="w-4 h-4 mr-2" /> View
              </Button>
              <Button onClick={() => handleDownload(certificate)} className="flex items-center gap-2">
                <Download className="w-4 h-4" /> <span>Download</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedCertificate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            className="bg-white p-4 rounded-lg max-w-4xl w-[90%] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedCertificate.imageUrl || "/placeholder.svg"}
              alt={`Certificate for ${selectedCertificate.recipientName}`}
              className="w-full h-auto"
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setSelectedCertificate(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
}