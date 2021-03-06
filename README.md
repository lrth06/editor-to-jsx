# editor-to-jsx

## Dependencies
- React... __THATS IT__!
 
### Purpose 
This library serves to be a lightweight utiltiy to parse data from [Editor.js](https://github.com/codex-team/editor.js), it was developed as the need arose for the ability to utilize the ease of use of [Editor.js](https://github.com/codex-team/editor.js), alongside [React](https://github.com/facebook/react), or the ever-increasing benefits of [NextJS](https://github.com/vercel/next.js)

Clean data output from [Editor.js](https://github.com/codex-team/editor.js) comes in JSON form, with an exact formatting of:
```json
{
    "time":1618024997507,
    "blocks":[
      {
        "type":"header",
        "data":{
          "text":"This is test data for editor-to-jsx",
          "level":1
        }
      },
      {
        "type":"embed",
        "data":{
          "service":"youtube",
          "source":"https://www.youtube.com/watch?v=VYUa5MxREkk",
          "embed":"https://www.youtube.com/embed/VYUa5MxREkk",
          "width":580,
          "height":320,
          "caption":"Caption for Embed<br>"
        }
      },
      {
        "type":"checklist",
        "data":{
          "items":[
            {
              "text":"Checklist Item 1 (checked)",
              "checked":true
            },
            {
              "text":"Checklist Item 2",
              "checked":false
            },
            {
              "text":"Checklist Item 3",
              "checked":false
            }
          ]
        }
      }   
    ],
    "version":"2.20.1"
  }
```

After parsing, the end result looks identical to the editor, as seen below:
![editor-to-jsx](https://github.com/lrth06/editor-to-jsx)


> Thank you for using this library, pull requests are welcome, and I hope this helps you in your ventures
> - Toby Hagan 

### Usage
There are currently two functions available from exitor-to-jsx:

- function __parseBlock__
- component __`<Block />`__
##### -Use With NextJS
 
 In this example, data is fetched with the [fetch API](https://) then passed as props to allow for server side rendering. the data passed to parseBlock() should be only one block from the entire article's array or blocks, as seen acomplished in the map() function below. The parseBlocks() function will return an array of props, which should then be passed on to the `<Block props={} />` component as props, with a key of props.key
```jsx
import { useContext,} from "react";
import { PostContext } from "../context/PostContext";
import {parseBlock, Block} from 'editor-to-jsx'
export default function Home({data}) {
  return (
    <div>
      {data.blocks&&(
        data.blocks.map(block=>{
          const props = parseBlock(block)
          return <Block key={props.key} props={props} />
        })
      )}
    </div>
  )
}
export const getServerSideProps = async () => {
  const res = await fetch('<your-endpoint-here>')

  const data = await res.json()
  return {
    props: {
      data,
    },
  }
}

```
##### -Use with React

```jsx
import {useEffect, useState} from 'react'
import {parseBlock, Block} from 'editor-to-jsx'
function App() {
    const [data, setData] = useState(null)
    const getData = async() => {
        const res = await fetch('<your-endpoint-here>')
        const initialData = await res.json()
        setData(initialData)
    }
    
    useState(()=>{
        getData()
    },[])

  return (
    <div>
      <header>
      {data.blocks&&(
        data.blocks.map(block=>{
          const props = parseBlock(block)
          return <Block key={props.key} props={props} />
        })
      )}
      </header>
    </div>
  );
}

export default App;

```