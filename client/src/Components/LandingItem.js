import React from 'react'

export const LandingItem = (props) => {

    return(<>
        <div style={{backgroundColor:"rgba(79, 84, 107, 0.7)", borderRadius: "20px", margin: "0.5em ", padding: "0.5em", display: "flex", alignItems: "center", aspectRatio: "1/1", height: "150px", justifyContent: "center"}}>
            <img src={props.item} width="100px" />
        </div>
    </>)
}