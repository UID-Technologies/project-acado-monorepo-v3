import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from '@/components/ui/ShadcnButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { uploadeAssignment } from '@services/learning/CourseService';

interface UploadAssignmentProps {
    show: boolean;
    onClose: () => void;
    content_id: number;
}

const AssignmentSchema = z.object({
    file: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "File file is required")
        .refine(
            (files) => ["application/pdf"].includes(files[0]?.type),
            "Only PDF files are allowed"
        ),
    note: z.string().min(1, "Note is required"),
});

type AssignmentFormData = z.infer<typeof AssignmentSchema>;

function UploadAssignment({ show, onClose, content_id }: UploadAssignmentProps) {


    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<AssignmentFormData>({
        resolver: zodResolver(AssignmentSchema),
    });


    const uploadAssignmentMutation = useMutation({
        mutationFn: uploadeAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learnerSubmittedAssignments', content_id] });
            queryClient.invalidateQueries({ queryKey: ['courseModule'] });
            toast.success('Assignment uploaded successfully')
            onClose()
            reset();
        },
        onError: (error) => {
            toast.error('Failed to upload assignment, please try again');
            console.log(error);
        }
    })


    const onSubmit = (data: AssignmentFormData) => {
        const formData = new FormData()
        formData.append('file', data.file[0])
        formData.append('user_notes', data.note)
        formData.append('content_id', content_id.toString())
        uploadAssignmentMutation.mutate(formData);
    };


    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Upload Assignment
                    </DialogTitle>
                    <DialogDescription>
                        Upload your assignment here
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
                        {/* description */}
                        <div>
                            <Label>Upload</Label>
                            <Input type='file' accept=".pdf" {...register("file")} />
                            <p className='text-xs text-gray-500'>Only PDF files are allowed</p>
                            {errors.file && <p className='text-red-500 text-sm'>{errors.file?.message}</p>}
                        </div>
                        {/* note */}
                        <div>
                            <Label>Note</Label>
                            <Textarea {...register("note")} />
                            {errors.note && <p className='text-red-500 text-sm'>{errors.note?.message}</p>}
                        </div>
                        <Button className='text-white' type='submit'>
                            {
                                uploadAssignmentMutation.isPending && <Loader size={16} className="mr-2 animate-spin" />
                            }
                            {/* Submit */}
                            {
                                uploadAssignmentMutation.isPending ? 'Uploading...' : 'Upload'
                            }
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UploadAssignment
