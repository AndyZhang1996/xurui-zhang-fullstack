class titleHandler{
  element(element){
    this.completeText = ''
  }

  text(text){
    this.completeText += text.text
    if(text.lastInTextNode){
      text.replace(`Variant ${this.completeText.includes('1') ? 'One' : 'Two'}`)
    }else{
      text.replace('')
    }
  }
}


class descriptionHandler{
  element(element){
    this.completeText = ''
  }

  text(text){
    this.completeText += text.text
    if(text.lastInTextNode){
      text.replace("Thank you so much for your effort to recruit more interns!")
    }else{
      text.replace('')
    }
  }
}

class buttonHandler{

  element(element){
    this.completeText = ''
    element.setAttribute('href', 'https://www.linkedin.com/in/xurui-andy-zhang-8b6960104/')
  }


  text(text){
    this.completeText += text.text
    if(text.lastInTextNode){
      text.replace("Connect with me on LinkedIn")
    }else{
      text.replace('')
    }
  }
}


const rewritter = new HTMLRewriter()
.on('title', new titleHandler())
.on('h1#title', new titleHandler())
.on('p#description', new descriptionHandler())
.on('a#url', new buttonHandler('href'))




addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const cookieKey = 'url='
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let chosenUrl
  let cookieString = request.headers.get('Cookie')

  if (cookieString) {
    let splitCookies = cookieString.split(';')
    for (let c of splitCookies) {
      c = c.trim()
      if (c.startsWith(cookieKey)) {
        chosenUrl = c.substring(cookieKey.length)
        break
      }
    }
  }
  if(!chosenUrl){
    let variantReturned = await fetch('https://cfw-takehome.developers.workers.dev/api/variants').then(response => {return response.json()})
    let urlArray = variantReturned.variants
    chosenUrl = urlArray[Math.floor(Math.random() * 2)]                //randomly choose one of the url by 50%
  }
  
  let returned = await fetch(chosenUrl)
  let response = rewritter.transform(returned)
  response.headers.set('Set-Cookie', cookieKey + chosenUrl)

  return response

  
}



