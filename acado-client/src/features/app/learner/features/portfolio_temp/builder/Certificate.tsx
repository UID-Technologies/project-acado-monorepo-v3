import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ZodType } from 'zod';
import { Input } from '@/components/ui/Input';
import { FormItem, Form } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { useForm, Controller } from 'react-hook-form';
import { FaIdCard } from 'react-icons/fa';
// types
import { Activity, CertificateActivity } from '@app/types/learner/portfolio';
import { addCertificateActivity, deleteActivity } from '@services/learner/Portfolio';
// icons
import { IdCard, Pencil, Trash } from 'lucide-react';
import { MdAdd } from 'react-icons/md';
import { useSnackbar } from "notistack";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

type CertificatesProps = {
    certificates: Activity[]
}

const Certificate = ({ certificates: initialCertificates }: CertificatesProps) => {

    const { enqueueSnackbar } = useSnackbar();
    const [certificates, setCertificate] = useState<Activity[]>(initialCertificates);
    const [showForm, setShowForm] = React.useState(false);

    const validationSchema: ZodType<CertificateActivity> = z.object({
        title: z.string().nonempty('Title is required'),
        institute: z.string().nonempty('Company is required'),
        start_date: z.string().nonempty('Start Date is required'),
        end_date: z.string().nonempty('End Date is required'),
        certificate: z
            .instanceof(File)
            .or(z.undefined()) // Allow undefined if the file is optional
            .refine((file) => file?.size !== undefined && file.size > 0, {
                message: "File is required",
            }),
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<CertificateActivity>({
        resolver: zodResolver(validationSchema),
    });

    const onSubmitData = (data: CertificateActivity) => {

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("institute", data.institute);
        formData.append("start_date", data.start_date);
        formData.append("end_date", data.end_date);
        formData.append("activity_type", "certificate");

        if (data.certificate) {
            formData.append("certificate", data.certificate);
        }

        addCertificateActivity(formData).then((response) => {
            enqueueSnackbar("Education added successfully", { variant: "success" });
            setShowForm(false);
            reset();
            setCertificate((prevCertificate) => [...prevCertificate, {
                title: data.title,
                institute: data.institute,
                start_date: data.start_date,
                end_date: data.end_date,
                activity_type: "certificate",
                image_name: data.certificate?.name
            }]);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            console.log('Done');
        });
    };

    const deleteCertificate = (certificateId?: number) => {
        if (certificateId) {
            deleteActivity(certificateId).then(() => {
                setCertificate((prevCertificate) => prevCertificate.filter((certificate) => certificate.id !== certificateId))
                enqueueSnackbar("Education deleted successfully", { variant: "success" });
            }).catch((error) => {
                enqueueSnackbar(error, { variant: "error" });
            }).finally(() => {
                console.log('Finally')
            });
        }
    }

    return (
        <div className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-5 mb-[3.4rem]">
            <div className='flex items-center gap-3 border-b pb-3 border-primary justify-between px-3'>
                <div className='flex items-center gap-2'>
                    <span className='text-xl text-primary'>Certificates / Awards</span>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='text-primary dark:text-primary flex items-center gap-1' onClick={() => setShowForm(!showForm)}>
                        {!showForm && <MdAdd size={20} />}
                        {showForm ? 'Show Data' : 'Add More'}
                    </button>
                </div>
            </div>
            {/* Data */}

            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
                    }`}>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-3 mt-5 rounded-lg">
                    {certificates && certificates.map((certificate, index) => (
                        <div key={index} className="bg-gray-100 border dark:bg-gray-900 shadow-md rounded-lg flex ps-2 relative">
                            <img src={`https://elms.edulystventures.com/portfolio/${certificate.image_name}`} alt={certificate.title} className="w-28" />
                            <div className="flex items-center gap-3 p-3">
                                <div>
                                    <h6 className="font-semibold text-primary dark:text-primary capitalize">{certificate.title}</h6>
                                    <p className="text-sm dark:text-gray-200 capitalize">{certificate.institute}</p>
                                    <p className="text-sm dark:text-gray-200">Issue date: {certificate.start_date}</p>
                                    <p className="text-sm dark:text-gray-200">Expiration date: {certificate.end_date}</p>
                                </div>
                            </div>
                            <div className="absolute right-4 top-4">
                                <button className="text-primary dark:text-primary" onClick={() => { deleteCertificate(certificate?.id) }}>
                                    <Trash size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <Table>
                    <TableHead>
                        <TableRow isHeader>
                            <TableCell isHeader>Sr. no</TableCell>
                            <TableCell isHeader>Name</TableCell>
                            <TableCell isHeader>Issuing organization</TableCell>
                            <TableCell isHeader>Issue date</TableCell>
                            <TableCell isHeader>Expiration date</TableCell>
                            <TableCell isHeader>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {certificates.map((certificate, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{certificate.title}</TableCell>
                                <TableCell>{certificate.institute}</TableCell>
                                <TableCell>{certificate.start_date}</TableCell>
                                <TableCell>{certificate.end_date}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <button className="text-primary dark:text-primary">
                                            <Pencil size={16} />
                                        </button>
                                        <button className="text-primary dark:text-primary" onClick={() => { deleteCertificate(certificate?.id) }}>
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> */}
            </div>
            {/* Form */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden mt-5 ${showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <Form onSubmit={handleSubmit(onSubmitData)}>
                    <div className="grid md:grid-cols-6 gap-3 mt-3">
                        <div className="col-span-3">
                            <FormItem
                                label="Title"
                                invalid={Boolean(errors.title)}
                                errorMessage={errors.title?.message}
                            >
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="title"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter Title"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Issuing organization"
                                invalid={Boolean(errors.institute)}
                                errorMessage={errors.institute?.message}
                            >
                                <Controller
                                    name="institute"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            id="institute"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter Company"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Issue date"
                                invalid={Boolean(errors.start_date)}
                                errorMessage={errors.start_date?.message}
                            >
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="month"
                                            id="start_date"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter Start Date"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Expiration date"
                                invalid={Boolean(errors.end_date)}
                                errorMessage={errors.end_date?.message}
                            >
                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="month"
                                            id="end_date"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter End Date"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                        <div className="col-span-3">
                            <FormItem
                                label="Upload Certificate"
                                invalid={Boolean(errors.certificate)}
                                errorMessage={errors.certificate?.message}
                            >
                                <Controller
                                    name="certificate"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="file"
                                            id="file"
                                            className="border rounded block w-full py-1.5 px-3"
                                            onChange={(e) => field.onChange(e.target.files?.[0])}
                                            ref={field.ref}
                                        />
                                    )}
                                />
                            </FormItem>

                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <Button variant="solid" className="mt-5 text-ac-dark">Add Certificate</Button>
                    </div>
                </Form>
            </div>
        </div >
    );
};

export default Certificate;
