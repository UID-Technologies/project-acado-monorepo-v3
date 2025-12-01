import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ZodType } from 'zod';
import { Input } from '@/components/ui/Input';
import { FormItem, Form } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from "notistack";
import { QueryRequest } from '@app/types/learner/mailbox';
import { addQuery } from '@services/learner/QueryService';
import { useNavigate } from 'react-router-dom';

const CreateQuery: React.FC = () => {

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const validationSchema: ZodType<QueryRequest> = z.object({
        title: z.string().nonempty('Title is required'),
        description: z.string().nonempty('Company is required'),
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<QueryRequest>({
        resolver: zodResolver(validationSchema),
    });

    const onSubmitData = (data: QueryRequest) => {
        const newQueryIs = { ...data, is_api: "1", type: '1' };
        addQuery(newQueryIs).then((data) => {
            enqueueSnackbar("Query Sent Successfully", { variant: "success" });
            reset();
            navigate('/help/mail-box?tab=sent');
        }).catch((error) => {
            console.log(error);
            enqueueSnackbar("Failed to send query", { variant: "error" });
        });
    };

    const onSubmitDraftData = (data: QueryRequest) => {
        const newQueryIs = { ...data, is_api: "1", type: '0' };
        addQuery(newQueryIs).then((data) => {
            enqueueSnackbar("Query Sent Successfully", { variant: "success" });
            reset();
            navigate('/help/mail-box?tab=drafts');
        }).catch((error) => {
            console.log(error);
            enqueueSnackbar("Failed to send query", { variant: "error" });
        });
    };

    return (
        <>
            <header className="p-4">
                <h1 className="text-3xl font-bold dark:text-darkPrimary text-lightPrimary capitalize">
                    Create a Query
                </h1>
            </header>
            <main className="flex-1 px-4">
                <Form>
                    <div className="grid md:grid-cols-1 gap-3 mt-3">
                        <div className="col-span-3">
                            <FormItem
                                label="Title"
                                className="mb-0"
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
                                label="Query"
                                className="mb-0"
                                invalid={Boolean(errors.description)}
                                errorMessage={errors.description?.message}
                            >
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            textArea
                                            type="text"
                                            id="description"
                                            className="border rounded block w-full py-1.5 px-3"
                                            placeholder="Enter Title"
                                            {...field}
                                            rows={10}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>
                    </div>
                    <div className='flex justify-end gap-4'>
                        <Button onClick={handleSubmit(onSubmitDraftData)} variant="solid" className="mt-5 text-ac-dark bg-lightPrimary">Save Draft</Button>
                        <Button onClick={handleSubmit(onSubmitData)} variant="solid" className="mt-5 text-ac-dark">Send Query</Button>
                    </div>
                </Form>
            </main>
        </>
    )
}

export default CreateQuery;
