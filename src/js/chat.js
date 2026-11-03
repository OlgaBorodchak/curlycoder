import { io } from 'socket.io-client'

export function initChat() {
  const toggle = document.getElementById('chat-toggle')
  const panel = document.getElementById('chat-panel')
  const closeBtn = document.getElementById('chat-close')
  const list = document.getElementById('chat-messages')
  const form = document.getElementById('chat-form')
  const input = document.getElementById('chat-input')
  const badge = document.getElementById('chat-badge')

  if (!toggle || !panel || !closeBtn || !list || !form || !input || !badge) {
    console.warn('Chat initialization failed: required elements are missing.')
    return
  }

  const CHAT_URL = import.meta.env.VITE_CHAT_URL || 'http://localhost:3000'

  const controller = new AbortController()
  const { signal } = controller

  let socket = null
  let welcomed = false

  // Add a message to the chat
  const addMessage = (text, sender) => {
    const message = document.createElement('li')

    message.className = `chat-msg chat-msg--${sender}`
    message.textContent = text

    list.appendChild(message)
    list.scrollTop = list.scrollHeight
  }

  // Connect to the chat server
  const connect = () => {
    if (socket) return

    socket = io(CHAT_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socket.on('owner:message', (text) => {
      addMessage(text, 'owner')

      if (panel.hidden) {
        badge.hidden = false
        toggle.setAttribute('aria-label', 'Chat with Olga (new reply)')
      }
    })

    socket.on('chat:error', (message) => {
      addMessage(message, 'error')
    })

    socket.on('connect_error', () => {
      addMessage(
        'Unable to connect to the chat. Please try again later.',
        'error',
      )
    })
  }

  // Open the chat panel
  const open = () => {
    panel.hidden = false
    toggle.setAttribute('aria-expanded', 'true')

    badge.hidden = true
    toggle.setAttribute('aria-label', 'Chat with Olga')

    connect()

    if (!welcomed) {
      addMessage(
        "Hi! I'm Olga. I'd love to hear about your project or opportunity. Tell me a little about it, and I'll get back to you here!",
        'owner',
      )

      welcomed = true
    }

    input.focus()
  }

  // Close the chat panel
  const close = () => {
    panel.hidden = true
    toggle.setAttribute('aria-expanded', 'false')
    toggle.focus()
  }

  // Toggle chat visibility
  toggle.addEventListener('click', () => (panel.hidden ? open() : close()), {
    signal,
  })

  closeBtn.addEventListener('click', close, { signal })

  // Close chat with Escape
  panel.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') close()
    },
    { signal },
  )

  // Send a message
  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault()

      const message = input.value.trim()

      if (!message) return

      if (!socket?.connected) {
        addMessage(
          'Message not sent. Please wait for the connection and try again.',
          'error',
        )
        return
      }

      socket.emit('visitor:message', message)

      addMessage(message, 'me')
      input.value = ''
      input.focus()
    },
    { signal },
  )

  // Return cleanup function
  return () => {
    controller.abort()
    socket?.disconnect()
    socket = null
  }
}
