/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 21 March 2025
@author:: Edulyst Ventures  
@purpose : This Component is used to render the PDF file in the viewer as well as the watermark on the PDF
@dependency : This component is dependent on the initialPage props

@@ Use case (if any use case) and solutions 

**/

import React from 'react'
import appConfig from '@app/config/app.config'
import { RenderPageProps } from '@react-pdf-viewer/core'

interface CopyrightProps {
    props: RenderPageProps
}

const Copyright: React.FC<CopyrightProps> = ({ props }) => {
    return (
        <div>
            {
                appConfig?.content?.pdf?.watermark?.show && (
                    appConfig?.content?.pdf?.watermark?.items?.map((item, index) => (
                        <div key={'watermark-' + index}
                            style={{
                                ...item.style,
                                fontSize: item.style?.fontSize || `${7 * props.scale}rem`,
                            }}
                            dangerouslySetInnerHTML={{ __html: item.text }}
                        />
                    ))
                )
            }
        </div>
    )
}

export default Copyright
