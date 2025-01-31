import React, { useState } from 'react'
import { Tooltip } from 'reactstrap';

const ToolTip = ({ id ,name,option }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);
    return (
        <>

            <Tooltip
                
                isOpen={tooltipOpen}
                target={id}
                toggle={toggle}
                placement={option}
            >
               {name}
            </Tooltip>
        </>
    )
}

export default ToolTip;