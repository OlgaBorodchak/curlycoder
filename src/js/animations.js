import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

export function footerAnimation() {
  const icons = document.querySelectorAll('.vertical-slider-track .svg')
  if (!icons.length) return

  let current = 0

  gsap.set(icons, { autoAlpha: 0, y: 18 })
  gsap.set(icons[0], { autoAlpha: 1, y: 0 })

  setInterval(() => {
    const next = (current + 1) % icons.length

    gsap.to(icons[current], { y: -18, autoAlpha: 0, duration: 0.8 })

    gsap.fromTo(
      icons[next],
      { y: 18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
    )

    current = next
  }, 1300)
}

export function bannerGlowAnimation() {
  const banner = document.querySelector('.banner')
  const glows = document.querySelectorAll('.banner-glow')
  if (!banner || !glows.length) return

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  if (prefersReducedMotion) return

  glows.forEach((glow) => moveRandomly(glow, banner))
}

function moveRandomly(el, container) {
  const bounds = container.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()

  const maxX = bounds.width - elRect.width
  const maxY = bounds.height - elRect.height

  const x = gsap.utils.random(0, Math.max(maxX, 0))
  const y = gsap.utils.random(0, Math.max(maxY, 0))

  gsap.to(el, {
    left: x,
    top: y,
    duration: gsap.utils.random(6, 10),
    ease: 'sine.inOut',
    onComplete: () => moveRandomly(el, container),
  })
}

export function headlineRevealAnimation() {
  const headline = document.querySelector('.banner-headline')

  if (!headline) return

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  if (prefersReducedMotion) return

  const visualHeadline = headline.querySelector('[aria-hidden="true"]')

  const split = new SplitType(visualHeadline, {
    types: 'chars',
  })

  gsap.from(split.chars, {
    autoAlpha: 0,
    y: 20,
    duration: 0.7,
    stagger: 0.02,
    ease: 'power2.out',
    delay: 0.2,
  })
}

export function headingsRevealAnimation() {
  ScrollTrigger.config({ ignoreMobileResize: true })

  const headings = gsap.utils.toArray('.fade-in-left')
  if (!headings.length) return

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  if (prefersReducedMotion) return

  headings.forEach((heading) => {
    gsap.from(heading, {
      xPercent: -8,
      opacity: 0,
      scrollTrigger: {
        trigger: heading,
        start: 'clamp(top 85%)',
        end: 'clamp(bottom 100%)',
        toggleActions: 'play none reverse none',
      },
    })
  })
}
