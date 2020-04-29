addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
  //event.respondWith(handleRequestBasic(event.request))
})

// ----------------
// handleRequest
// ----------------
/**
 * do task with bonus requirements (cookies, etc.)
 * @param {Request} the request, url is ignored
 */
async function handleRequest(request) {
	const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
	const name = 'CookieType'
	
	const resp = await fetch(url)
		.then(r => r.json())
	const returnedUrls = resp.variants
	
	const cookie = request.headers.get('Cookie')
	var cookieType
	if (cookie) {
    	let a = cookie.split(';')
    	a.forEach(amember =>{
    		let cookieName = amember.split('=')[0].trim()
    		if(cookieName === name){
    			cookieType = amember.split('=')[1]
    		}
    	})
  	}
  	
	if(cookieType != 0 && cookieType != 1){
		cookieType = Math.floor(Math.random()*2)
		const midfetch = await fetch(returnedUrls[cookieType])
		const response = new Response(midfetch.body, midfetch)
		const addCookie = `${name} = ${cookieType}; path ='/'`
		response.headers.append('set-cookie', addCookie)
		const out = new HTMLRewriter()
			.on('*', new AttributeRewriter('' + cookieType))
			.transform(response)
		return out
	} else {
		const midfetch = await fetch(returnedUrls[cookieType])
		const response = new Response(midfetch.body, midfetch)
		const out = new HTMLRewriter()
			.on('*', new AttributeRewriter('' + cookieType))
			.transform(response)
		return out
	}
	
	
}

//--------------
// AttributeRewriter
//--------------
/**
 * class to rewrite html attributes, based on a Cloudflare Workers Template
 */
class AttributeRewriter {
  	constructor(attributeName) {
    	this.attributeName = attributeName
  	}

  	element(element) {
    	const attribute = element.getAttribute(this.attributeName)
    	if (element.tagName == 'h1') {
      		if (this.attributeName == '0') {
        		element.setInnerContent("1st var")
      		} else {
        		element.setInnerContent("I assume this is the 2nd var")
      		}
		}
    	if (element.tagName == 'title') {
      		if (this.attributeName == '0') {
        		element.setInnerContent('This should be a title')
      		} else {
       			 element.setInnerContent('I am not the best namer')
      		}
    	}
    	if (element.tagName == 'p') {
      		if (this.attributeName == '0') {
        		element.setInnerContent("Why did the chicken cross the road?")
      		} else {
       		 	element.setInnerContent("I'm not sure.")
     	 	}
    	}
    	if (element.tagName == 'a') {
      		if (this.attributeName == '0') {
        		element.setInnerContent("This is my github")
        		element.setAttribute('href', "https://github.com/dxlerate")
      		} else {
        		element.setInnerContent("This is not my github, this is google")
        		element.setAttribute('href', "https://www.google.com")
      		}
    	}
  	}
}





// ----------------
// handleRequestBasic
// ----------------
/**
 * do basic task
 * @param {Request} the request, url is ignored
 */
async function handleRequestBasic(request) {
	const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
	
	let json = await fetch(url)
		.then(response => response.json())
	let returnedUrls = json.variants
	
	let choice = Math.floor(Math.random()*2)
	return await fetch(returnedUrls[choice])
}
