'use client'

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { Children, cloneElement, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../stylesheet/Dock.css'

function DockItem({
  children,
  className = '',
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  isActive
}) {
  const ref = useRef(null)
  const isHovered = useMotionValue(0)

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize }
    return val - rect.x - baseItemSize / 2
  })

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  )
  const size = useSpring(targetSize, spring)

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={`dock-item ${isActive ? 'dock-item--active' : ''} ${className}`}
      tabIndex={-1}
    >
      {Children.map(children, (child) => cloneElement(child, { isHovered }))}
    </motion.div>
  )
}

function DockLabel({ children, className = '', ...rest }) {
  const { isHovered } = rest
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const unsub = isHovered.on('change', (v) => setIsVisible(v === 1))
    return () => unsub()
  }, [isHovered])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DockIcon({ children, className = '' }) {
  return <div className={`dock-icon ${className}`}>{children}</div>
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  baseItemSize = 50,
  hideOnScroll = true
}) {
  const { pathname } = useLocation()
  const mouseX = useMotionValue(Infinity)
  const isHovered = useMotionValue(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!hideOnScroll) return
    let lastY = window.scrollY
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - lastY

        if (y < 10) setHidden(false)
        else if (delta > 10) setHidden(true)
        else if (delta < -10) setHidden(false)

        lastY = y
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hideOnScroll])

  const isActive = (to, exact) => {
    if (!to) return false
    if (exact) return pathname === to
    return pathname === to || pathname.startsWith(to + '/')
  }

  return (
    <motion.div
      className="dock-outer"
      animate={hidden ? { y: 90, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1)
          mouseX.set(pageX)
        }}
        onMouseLeave={() => {
          isHovered.set(0)
          mouseX.set(Infinity)
        }}
        className={`dock-panel ${className}`}
        role="toolbar"
      >
        {items.map((item, index) => {
          const active = item.to ? isActive(item.to, item.exact) : false

          const content = (
            <DockItem
              key={index}
              className={item.className}
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
              isActive={active}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          )

          if (item.to) {
            return (
              <Link key={index} to={item.to} className="dock-link">
                {content}
              </Link>
            )
          }

          return (
            <button
              key={index}
              type="button"
              className="dock-btn"
              onClick={item.onClick}
            >
              {content}
            </button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
