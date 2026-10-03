import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, useGSAP)

// Mobile browsers resize the viewport when the address bar hides; don't recompute pins for that.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, useGSAP }
