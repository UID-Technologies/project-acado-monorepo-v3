import React, { useMemo } from 'react'
import PdfRender from '../pdf';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from '@tanstack/pacer';
import { CommonModuleContent } from '@app/types/learning/courses';
import { saveContentCompletion } from '@services/learning/CourseService';

interface AssessmentProps {
    content: CommonModuleContent;
}

const Notes = ({ content }: AssessmentProps) => {

    const queryClient = useQueryClient();
    const onDocumentLoad = (numPages: number) => {
        console.log('numPages', numPages);
    }


    const saveContentCompletionMutation = useMutation({
        mutationFn: saveContentCompletion,
        onSuccess: (data) => {
            console.log('Content completion saved:', data);
            queryClient.invalidateQueries({ queryKey: ['courseModule'] });
        },
        onError: (error) => {
            console.error('Error saving content completion:', error);
        },
    });

    const debouncedSave = useMemo(
        () =>
            debounce((formData: FormData) => {
                saveContentCompletionMutation.mutate(formData);
            }, { wait: 2000 }),
        [saveContentCompletionMutation]
    );

    const onPageChange = (page: number, numPages: number) => {
        console.log("current oage ", page);
        console.log("current oage num page", numPages);
        const precentage = ((page + 1) / numPages) * 100;

        if (!content?.program_content_id) {
            return;
        }

        if (content?.completion >= "100") {
            return;
        }

        if (page === 0) {
            return;
        }

        const formData = new FormData();
        formData.append('bookmark', page.toString());
        formData.append('content_id', content?.program_content_id.toString());
        formData.append('completion', Math.floor(precentage).toString());
        debouncedSave(formData);
    }

    return (
        <div className="overflow-hidden mb-6 h-[450px]">
            <PdfRender fileUrl={content?.url} onDocumentLoad={onDocumentLoad} onPageChange={onPageChange} />
        </div>
    )
}


export default Notes;
