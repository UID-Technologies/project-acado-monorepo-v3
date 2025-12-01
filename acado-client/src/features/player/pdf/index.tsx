/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 21 March 2025
@author:: Edulyst Ventures  
@purpose : This Component is used to render the PDF file in the viewer
@dependency : This component is dependent on the @react-pdf-viewer/core and @react-pdf-viewer/toolbar packages and fileUrl, onPageChange, onDocumentLoad, initialPage props

@@ Use case (if any use case) and solutions 

**/

import * as React from 'react';
import { ProgressBar, RenderPage, RenderPageProps, Viewer, Worker } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import type { ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import Copyright from './copyright';


interface PdfRenderProps {
    fileUrl: string;
    onPageChange?: (page: number, numPages: number) => void;
    onDocumentLoad?: (numPages: number) => void;
    initialPage?: number;
}

const PdfRender: React.FC<PdfRenderProps> = ({ fileUrl, onPageChange, onDocumentLoad, initialPage = 0 }) => {
    const toolbarPluginInstance = toolbarPlugin();
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

    const transformToolbar: TransformToolbarSlot = (slot: ToolbarSlot) => ({
        ...slot,
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
        Open: () => <></>,
        OpenMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>,
        // EnterFullScreen: () => <></>,
        // EnterFullScreenMenuItem: () => <></>,
    });

    const renderPageWithCopyright: RenderPage = (props: RenderPageProps) => (
        <>
            {props.canvasLayer.children}
            <Copyright props={props} />
            {props.annotationLayer.children}
            {props.textLayer.children}
        </>
    );


    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
            <div
                className="rpv-core__viewer rounded overflow-hidden border p-2 bg-white"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <div
                    className='border rounded overflow-hidden mb-3'
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        padding: '0.25rem',
                    }}
                >
                    <Toolbar>{renderDefaultToolbar(transformToolbar)}</Toolbar>
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Viewer
                        theme="auto"
                        fileUrl={fileUrl}
                        plugins={[toolbarPluginInstance]}
                        renderPage={renderPageWithCopyright}
                        initialPage={initialPage}
                        renderLoader={(percentages: number) => (
                            <div style={{ width: '240px' }}>
                                <ProgressBar progress={Math.round(percentages)} />
                            </div>
                        )}
                        onDocumentLoad={(e) => { onDocumentLoad && onDocumentLoad(e.doc.numPages); }}
                        onPageChange={(e) => onPageChange && onPageChange(e.currentPage, e.doc.numPages)}
                    />
                </div>
            </div>
        </Worker>
    );
};

export default PdfRender;
