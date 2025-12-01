import React, { useRef, useState } from 'react';
import { BsPeople } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { fetchCreateContent } from '@services/learner/CreateContentService';

function createContent() {

    const editor = useRef(null);

    const navigate = useNavigate();

    const config = {
        readonly: false,
        height: 400,
        toolbarButtonSize: 'middle',
        buttons: [
            'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', '|',
            {
                name: 'paragraph',
                text: 'Text Format',
                tooltip: 'Choose Text Format',
                list: {
                    h1: 'Heading 1',
                    h2: 'Heading 2',
                    h3: 'Heading 3',
                    h4: 'Heading 4',
                    h5: 'Heading 5',
                    h6: 'Heading 6',
                    p: 'Paragraph',
                    blockquote: 'Blockquote',
                    pre: 'Code Block'
                }
            }, '|',
            'font', 'fontsize', 'brush', '|', 'align', 'outdent', 'indent', '|', 'ul', 'ol', '|',
            {
                name: 'insertMenu',
                text: 'Insert',
                tooltip: 'Insert Media or Elements',
                list: {
                    image: 'Insert Image',
                    video: 'Insert Video',
                    file: 'Attach File',
                    link: 'Insert Link',
                    table: 'Insert Table',
                }
            }, '|', 'fullsize', 'print', 'preview'
        ],
        spellcheck: true,
        iframe: true,
        allowResizeX: false,
        allowResizeY: true,
        showXPathInStatusbar: false,
        showCharsCounter: true,
        showWordsCounter: true,
        toolbarAdaptive: true,
        useSplitMode: false,
        direction: 'ltr',
        uploader: {
            insertImageAsBase64URI: true,
        },
    };


    const location = useLocation();
    const { community } = location.state || {};


    const [formData, setFormData] = useState({
        category_id: community?.id,
        title: '',
        description: '',
        content_type: 'carvaan',
        post_type: '',
        status: 1,
        aspect_ratio: '',
        dimension: { height: 0, width: 0 },
        thumbnail: null,
        file: null
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] })
        }
    }


    const handleSubmit = async () => {
        setLoading(true)
        try {
            await fetchCreateContent(formData);
            navigate(`/communities/${community?.id}`)
        } catch (err) {
            setError(err as string)
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            <div className="relative h-[300px] md:h-[400px] bg-[#1A1D29] overflow-hidden rounded-lg">
                <div className="absolute inset-0">
                    <img
                        src={community?.image || "https://default-image-url.com"}
                        alt={community?.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
            <div className="relative md:max-w-5xl -mt-72 mx-auto bg-white rounded-lg p-3">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Post</h1>
                <div className='mb-3 border-t pt-3'>
                    <label className="block mb-2">Title</label>
                    <input type="text" name="title" placeholder='title' value={formData.title} className="w-full p-2 border rounded" onChange={handleInputChange} />
                </div>
                <div>
                    <label className="block mb-2">Description</label>
                    <JoditEditor
                        ref={editor}
                        value={formData.description}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent: string) => setFormData({ ...formData, description: newContent })}
                        onChange={(newContent: string) => { }}
                    />
                </div>
                <div>
                    <label className="block mt-4 mb-2">Post Type </label>
                    <select name="post_type" value={formData.post_type} className="w-full p-2 border rounded" onChange={handleInputChange}>
                        <option value="">Select Post Type</option>
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>
                </div>
                <div>
                    <label className="block mt-4 mb-2">Thumbnail</label>
                    <input type="file" name="thumbnail" className="w-full p-2 border rounded" onChange={handleFileChange} />
                </div>
                <div>
                    <label className="block mt-4 mb-2">File (Image/Video)</label>
                    <input type="file" accept="image/*,video/*" className="w-full p-2 border rounded" onChange={(e) => setFormData({ ...formData, file: e.target.files ? e.target.files[0] : null })} />
                </div>

                <div className="flex justify-end mt-4">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                        Cancel
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleSubmit}>
                        {
                            loading ? 'Creating...' : 'Create'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default createContent
