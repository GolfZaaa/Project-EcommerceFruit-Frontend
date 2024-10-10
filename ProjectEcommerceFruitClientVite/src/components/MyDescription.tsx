import React from 'react'
import { fontSizesmall } from '../api/agent'
import HTMLReactParser from "html-react-parser/lib/index";

export default function MyDescription({text}:any) {
  return (
    <div>
        <p style={{fontSize:fontSizesmall}}>
             {HTMLReactParser(text)}
        </p>
    </div>
  )
}
