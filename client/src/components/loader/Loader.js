import React, { useState } from 'react'
import { css } from '@emotion/react'
import { PuffLoader } from 'react-spinners'

const override = css`
  display: block;
  margin: 0 auto;
  border-color: green;
`;

const Loader = () => {
    const [color] = useState('#00d0f1')
    const [loading] = useState(true)

    return (
        <PuffLoader 
            color = {color} 
            loading = {loading}
            css = {override}
            size = {200}
        />
    )
}

export default Loader