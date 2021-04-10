 const React = require('react')
 function parseBlock(block){
    const type = block.type || null
    const text = block.data.text || null
    const code = block.data.code || null
    const url = block.data.url || null
    const link = block.data.link || null
    const caption = block.data.caption || null
    const listStyle =block.data.style || null  
    const key = type+text+code+url+caption+listStyle

    let props={key:key,style:{width:"650px", maxWidth:"100%",display:"block", margin:"auto", padding:"10px 0 ",}}

    if (block.type === "header"){
        props.type = `h${block.data.level}`
        props.content  = block.data.text
        }
        
    if(block.type ==="paragraph"){
        props.type = 'p'
        props.content = text.replace(/(<([^>]+)>)/gi, "")
    }
    if(type ==="quote"){
        props.type=`blockquote`
        props.content= `"${text.replace(/(<([^>]+)>)/gi, "")}" - ${block.data.caption}`
    }

    if(type === "linkTool"){
       props.type='div'
        props.content=[React.createElement('a', {href:link,key:link+block.data.meta.title ,style:{color:'blue'}},block.data.meta.title? block.data.meta.title: `${link}`)]
    }
    if(type ==="raw"){
        props.type = `pre`
        props.content = block.data.html
        props.style.minHeight="200px"
        props.style.backgroundColor="#1E2128"
        props.style.color="#A1A7B6"
        props.style.padding="12px"
        props.style.borderRadius="3px"
        props.style.fontSize="12px"

    }
    if(type==="embed"){
        props.type='div'
        props.display="block"
        embedStyle={width:block.data.width,height:block.data.height,margin: 'auto', display: 'block'}
        captionStyle={
            fontSize:`medium`,
            width:block.data.width,
            margin:"25px",
            padding:"25px"
        }
        props.content=[
            React.createElement('embed', {key:key,style:embedStyle, src:block.data.embed},),
            React.createElement('span', {key:key+1, title:block.data.caption,style:captionStyle},block.data.caption.replace(/(<([^>]+)>)/gi, "")),
        ]
    }
    // if(type === 'warning'){
    //     props.type = 'div'
    //     props.style.background = 'khaki'
    //     props.content=[
    //         React.createElement('div',{key:key+block.data.title, style:{padding:'15px'}},block.data.title,
    //         React.createElement('svg',{},``),
    //         React.createElement('p',{},block.data.message)
    //         )
    //     ]
    // }
    if(type ==="checklist"){
        props.type='div'
        props.style.listStyle='none'
        props.style.paddingLeft="15px"
        props.content=[
            block.data.items.map(item=>{
                return [
                    React.createElement('ul',{key:key},
                        React.createElement('input', {type:"checkbox", readOnly:true,key:key,id:item.checked+item.text,
                        checked:item.checked? true:false,label:item.text, style:{padding:"5px"},
                        background:item.checked? 'blue':'white',
                    },
                    ),
                    React.createElement('label',{key:key+1,htmlFor:item.checked+item.text},`${item.text}`)
                    )]
            })
        ]
    }
    if(type ==='delimiter'){
        props.type='p'
        props.style.fontSize='25px'
        props.style.textAlign='center'
        props.style.letterSpacing='0.5em'
        props.content=`***`
    }
    if(type === "code"){
        props.type = `code`
        props.content = code
        props.style.minHeight="200px"
        props.style.backgroundColor="white"
        props.style.padding="12px"
        props.style.borderRadius="3px"
        props.style.fontSize="12px"
    }
    if(type === "list"){
        let prefix = listStyle === 'ordered'? 'o':'u' 
        props.type =prefix+'l' 
            props.content = [
                block.data.items.map(item=>{
                    item = item.replace(/(<([^>]+)>)/gi, "");
                  return  React.createElement('li',{key:key+item ,style:{margin:"15px 25px"}}, `${item}`)
                })
            ]
    }
    if(type === "simpleImage" || type ==="Image"){
        props.type='div'
    
        localStyle={
            width:"100%",
            padding:"10px 0",
            caption:{
                fontSize:`medium`,
                width:"650px",
                margin:'0px 10px'
            }
        }
        const withBorder = block.data.withBorder
        const withBackground = block.data.withBackground
        const stretched = block.data.stretched
       
        if(stretched){
            props.style.width="100%"
            props.style.margin="0"
            props.style.padding='0'
        }
        if(withBorder){
            localStyle.border="1px solid white"
            localStyle.padding="0"
            if(stretched){
                props.style.width = "calc(100% - 2px)"
            }

        }
        props.content = [
            React.createElement('img' ,{src:url,style:localStyle ,key:url+block.data.caption, alt:block.data.caption.replace(/(<([^>]+)>)/gi, "")}),
            React.createElement('span' ,{style:localStyle.caption, key:block},block.data.caption.replace(/(<([^>]+)>)/gi, ""))        
            ]

            if(withBackground && !stretched){
                localStyle.width="60%"
                localStyle.margin="auto"
                localStyle.display="block"    
                localStyle.caption.width="60%" 
                localStyle.caption.display="block"       
                props.content = [
                    React.createElement('div', {key:key+1,style:{backgroundColor:"white", margin:"auto", padding:"1px", display:"block",}},
                    React.createElement('img' ,{src:url,style:localStyle ,key:url+block.data.caption, alt:block.data.caption.replace(/(<([^>]+)>)/gi, "")}),
                    ),
                    React.createElement('span' ,{style:localStyle.caption, key:block},block.data.caption.replace(/(<([^>]+)>)/gi, ""))        
                    ]
            }
     
    }
    if(type ==="table"){
        props.type = 'table'
        props.style.borderCollapse="collapse"

        length= block.data.content.length

        props.content=[
            React.createElement('tbody',{key:key+block.data.content[0]+block.data.content[1]},
            React.createElement('tr',{key:key+block.data.content[0][0]+block.data.content[0][1], style:{width:"650px",}},
                block.data.content[0].map(item=>{
                    return React.createElement('th', {key:key+item,style:{padding:'5px 0',border:"1px solid black",  },width:650/(block.data.content.length)+`px`},`${item.replace(/(<([^>]+)>)/gi, "")}`)
                })
            ),
           block.data.content.slice(1).map(items=>{
              return React.createElement('tr',{key:key+items[0]+items[1],style:{width:'650px',}},
               items.map(item=>{
                return React.createElement('td', {key:key+item,style:{border:"1px solid black", }}, `${item.replace(/(<([^>]+)>)/gi, "")}`)
               }) 
               
               )
              
           })
            )
        ]
    }
   
    return props
}




 function Block({props}){
if(props.type ==='list'){
    return null
}
    else if(props.type){
    const {type,content, style,key,src}= props
   return React.createElement(type,{style:style,key:key, src:src}, content )
}
else return null

}

module.exports={parseBlock, Block}