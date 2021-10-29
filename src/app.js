// Load icons
import {setCSSVar} from './js/utils/setCSSVar'

const requireAll = (r) => r.keys().forEach(r)
requireAll(require.context('./icons', true, /\.svg$/))

// Load plugins
import svg4everybody from 'svg4everybody'
import {isTouchEnabled} from './js/utils/isTouchEnables'
import {isMobileDevice} from './js/utils/isMobileDevice'
import {parseJSON} from './js/utils/parseJSON'
import {wait} from './js/utils/wait'
import {debounce} from './js/utils/debounce'
import {getCurrentLang} from './js/utils/getCurrentLang'

window.svg4everybody = svg4everybody

// media queries (if used in js)
export const mq = {
  tabletAbove: '(min-width: 1281px)',
  tablet: '(max-width: 1280px)',
  tabletXs: '(max-width: 920px)',
  tabletXsAbove: '(min-width: 921px)',
  mobile: '(max-width: 767px)',
  mobileAbove: '(min-width: 768px)'
}

// Create global App object
window.App = {
  lang: getCurrentLang(),
  scrollableBody: 'body',
  debug: window.location.port.length || (window.location.search.indexOf('debug') > -1) || window.location.pathname.indexOf('/build/') > -1,
  stateClasses: {
    domReady: 'dom-is-ready',
    pageLoaded: 'page-is-loaded',
    touchscreen: 'is-touchscreen',
    mobileDevice: 'is-mobile-device'
  },
}

// load modules
import SvgUse from './js/svgUse'
import Modals from './js/modals'
import Forms from './js/forms/forms'
import ScrollEffects from './js/scrollEffects'
import Gallery from './js/gallery'

// Load components
import './components/header'
import './components/footer'
import './components/breadcrumbs'
import './components/logo'
import './components/btn'
import './components/input'

// Load collections
import {GoogleCaptchaCollection} from './components/grecaptcha'
import {FileAttachCollection} from './components/file-attach'

// Load styles
import './styles'

const checkMobile = () => {
  (isMobileDevice()) ? document.documentElement.classList.add(App.stateClasses.mobileDevice) : document.documentElement.classList.remove(App.stateClasses.mobileDevice)
}

const checkTouch = () => {
  (isTouchEnabled()) ? document.documentElement.classList.add(App.stateClasses.touchscreen) : document.documentElement.classList.remove(App.stateClasses.touchscreen)
}

const checkSpecificBrowser = () => {
  let browserClass = ''
  switch (true) {
    case !!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/)):
      browserClass = 'ie11'
      break
    case !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/):
      browserClass = 'safari'
      break
    case /Edge/.test(navigator.userAgent):
      browserClass = 'edge'
      break
    default:
      break
  }
  if (browserClass) {
    document.documentElement.classList.add(browserClass)
  }
}

const vhFix = () => {
  setCSSVar(document.documentElement, 'vh', `${window.innerHeight * 0.01}px`)
}

const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth
}

const setScrollbarWidth = () => {
  setCSSVar(document.documentElement, 'scrollbar-width', `${getScrollbarWidth()}px`)
}

const setVhFix = () => {
  vhFix()

  const debouncedResizeHandler = debounce(() => vhFix())
  window.addEventListener('resize', () => {
    debouncedResizeHandler()
  })
}

const handleDOMReady = () => {
  // utils
  checkTouch()
  checkMobile()
  checkSpecificBrowser()
  setVhFix()
  setScrollbarWidth()

  // standalone components
  new SvgUse()
  new Modals()
  new Forms()
  new Gallery()

  // app components
  App.ScrollEffects = new ScrollEffects()
  App.GoogleCaptchaCollection = new GoogleCaptchaCollection()
  App.FileAttachCollection = new FileAttachCollection()

  // prevent transition flicker
  wait(100).then(() => {
    document.documentElement.classList.add(App.stateClasses.domReady)
  })
}

const handleResize = () => {
  checkTouch()
  checkMobile()
}

const handleWindowLoad = () => {
  document.documentElement.classList.add(App.stateClasses.pageLoaded)
}

const bindEvents = () => {
  document.addEventListener('DOMContentLoaded', () => {
    handleDOMReady()
  })
  document.addEventListener('resize', () => {
    handleResize()
  })
  window.addEventListener('load', () => {
    handleWindowLoad()
  })
}

bindEvents()
