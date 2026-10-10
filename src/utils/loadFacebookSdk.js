const FB_SDK_SCRIPT_ID = 'facebook-jssdk'
const FB_SDK_VERSION = 'v22.0'
const FB_SDK_LOCALE = 'es_LA'

let sdkLoadPromise = null

function ensureFbRoot() {
  if (!document.getElementById('fb-root')) {
    const root = document.createElement('div')
    root.id = 'fb-root'
    document.body.prepend(root)
  }
}

export function loadFacebookSdk() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  if (window.FB) {
    return Promise.resolve(window.FB)
  }

  if (sdkLoadPromise) {
    return sdkLoadPromise
  }

  sdkLoadPromise = new Promise((resolve, reject) => {
    ensureFbRoot()

    const existingScript = document.getElementById(FB_SDK_SCRIPT_ID)
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.FB))
      existingScript.addEventListener('error', reject)
      return
    }

    window.fbAsyncInit = function fbAsyncInit() {
      window.FB.init({
        xfbml: true,
        version: FB_SDK_VERSION,
      })
      resolve(window.FB)
    }

    const script = document.createElement('script')
    script.id = FB_SDK_SCRIPT_ID
    script.src = `https://connect.facebook.net/${FB_SDK_LOCALE}/sdk.js`
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    script.onerror = reject
    document.body.appendChild(script)
  })

  return sdkLoadPromise
}
