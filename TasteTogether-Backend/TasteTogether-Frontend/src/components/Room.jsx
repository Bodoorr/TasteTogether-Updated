import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../services/api'
import { io } from 'socket.io-client'
import SimplePeer from 'simple-peer'
import {
  Box,
  Text,
  HStack,
  Heading,
  Button,
  Badge,
  IconButton,
  SimpleGrid,
  Avatar
} from '@chakra-ui/react'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  MonitorX
} from 'lucide-react'

const SERVER_URL = BASE_URL

const getImageUrl = (image) => {
  if (!image) return null
  if (image.startsWith('http') || image.startsWith('data:')) return image
  return `${image}`
}

const Room = ({ user }) => {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const localVideoRef = useRef(null)
  const [remoteStreams, setRemoteStreams] = useState({})
  const [usersInfo, setUsersInfo] = useState({})
  const socketRef = useRef(null)
  const peersRef = useRef({})
  const localStreamRef = useRef(null)
  const signalBufferRef = useRef({})
  const bufferedUsers = useRef([])

  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [screenSharing, setScreenSharing] = useState(false)

  const { username, image } = user || {}

  // Manage maximized video id (null means no maximized video)
  const [maximizedId, setMaximizedId] = useState('local')

  useEffect(() => {
    if (!user) {
      navigate('/signin')
      return
    }

    socketRef.current = io(SERVER_URL)

    socketRef.current.on('all-users', (users) => {
      const info = {}
      users.forEach(({ id, username, image }) => {
        info[id] = { username, image }
      })
      setUsersInfo(info)

      if (localStreamRef.current) {
        users.forEach(({ id }) => createPeer(id, true))
      } else {
        bufferedUsers.current = users.map((u) => u.id)
      }
    })

    socketRef.current.on('user-joined', (user) => {
      setUsersInfo((prev) => ({
        ...prev,
        [user.id]: { username: user.username, image: user.image }
      }))

      if (localStreamRef.current) {
        createPeer(user.id, false)
      } else {
        bufferedUsers.current.push(user.id)
      }
    })

    socketRef.current.on('signal', ({ from, signal }) => {
      const peer = peersRef.current[from]
      if (peer && typeof peer.signal === 'function') {
        peer.signal(signal)
      } else {
        if (!signalBufferRef.current[from]) {
          signalBufferRef.current[from] = []
        }
        signalBufferRef.current[from].push(signal)
      }
    })

    socketRef.current.on('user-disconnected', (userId) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].destroy()
        delete peersRef.current[userId]
        setRemoteStreams((prev) => {
          const copy = { ...prev }
          delete copy[userId]
          return copy
        })
      }
      setUsersInfo((prev) => {
        const copy = { ...prev }
        delete copy[userId]
        return copy
      })
    })

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream
        if (localVideoRef.current) localVideoRef.current.srcObject = stream

        socketRef.current.emit('join-room', { roomId, username, image })

        bufferedUsers.current.forEach((userId) => createPeer(userId, true))
        bufferedUsers.current = []
      })
      .catch((err) => {
        console.error('getUserMedia failed:', err, err.name)
        alert(`Camera/Mic error: ${err.name}`)
      })

    return () => cleanup()
  }, [roomId, user])

  function cleanup() {
    socketRef.current?.disconnect()
    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    Object.values(peersRef.current).forEach((peer) => peer.destroy())
    peersRef.current = {}
    setRemoteStreams({})
    setUsersInfo({})
  }

  function createPeer(userId, initiator) {
    if (!localStreamRef.current) return
    if (!userId) return
    if (peersRef.current[userId]) return
    if (socketRef.current?.id && userId === socketRef.current.id) return

    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream: localStreamRef.current
    })

    peer.on('signal', (signal) => {
      socketRef.current.emit('signal', { roomId, to: userId, signal })
    })

    peer.on('stream', (remoteStream) => {
      setRemoteStreams((prev) => ({ ...prev, [userId]: remoteStream }))
    })

    peer.on('error', (e) => {
      console.error('Peer error for', userId, e)
    })

    peer.on('close', () => {
      setRemoteStreams((prev) => {
        const copy = { ...prev }
        delete copy[userId]
        return copy
      })
      delete peersRef.current[userId]
    })

    peersRef.current[userId] = peer

    if (signalBufferRef.current[userId]) {
      signalBufferRef.current[userId].forEach((bufferedSignal) => {
        peer.signal(bufferedSignal)
      })
      delete signalBufferRef.current[userId]
    }
  }

  const toggleAudio = () => {
    const next = !audioEnabled
    setAudioEnabled(next)

    const stream = localStreamRef.current
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = next))
    }

    Object.values(peersRef.current || {}).forEach((peer) => {
      const pc = peer?._pc
      if (!pc) return
      pc.getSenders().forEach((sender) => {
        if (sender.track?.kind === 'audio') sender.track.enabled = next
      })
    })
  }

  const toggleVideo = () => {
    if (!localStreamRef.current) return
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled
      setVideoEnabled(track.enabled)
    })
  }

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        })

        replaceStreamTracks(screenStream)
        screenStream.getVideoTracks()[0].onended = () => stopScreenShare()
        setScreenSharing(true)
      } catch (err) {
        console.error('Error sharing screen:', err)
      }
    } else {
      stopScreenShare()
    }
  }

  const stopScreenShare = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: audioEnabled
      })
      replaceStreamTracks(cameraStream)
      setScreenSharing(false)
    } catch (err) {
      console.error('Failed to get camera stream after screen share:', err)
    }
  }

  const replaceStreamTracks = (newStream) => {
    const oldStream = localStreamRef.current
    localStreamRef.current = newStream
    if (localVideoRef.current) localVideoRef.current.srcObject = newStream

    Object.values(peersRef.current).forEach((peer) => {
      oldStream.getTracks().forEach((oldTrack) => {
        const newTrack = newStream
          .getTracks()
          .find((t) => t.kind === oldTrack.kind)
        if (newTrack) {
          peer.replaceTrack(oldTrack, newTrack, oldStream)
        }
      })
    })
  }

  const disconnectCall = () => {
    cleanup()
    navigate('/rooms')
  }

  // click handler for toggle maximize/minimize video
  const handleVideoClick = (id) => {
    setMaximizedId((prevId) => (prevId === id ? null : id))
  }

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 8 }}
    >
      <Box maxW="1200px" mx="auto">
        <HStack
          justify="space-between"
          align="center"
          mb={6}
          flexWrap="wrap"
          gap={3}
        >
          <Box>
            <Heading size="lg" color="gray.900">
              Room
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              ID:{' '}
              <Box as="span" fontFamily="mono">
                {roomId}
              </Box>
            </Text>
          </Box>

          <HStack spacing={2}>
            <Badge
              borderRadius="full"
              colorScheme={screenSharing ? 'purple' : 'gray'}
            >
              {screenSharing ? 'Screen sharing' : 'Camera view'}
            </Badge>
            <Badge
              borderRadius="full"
              colorScheme={audioEnabled ? 'green' : 'red'}
            >
              {audioEnabled ? 'Mic on' : 'Mic off'}
            </Badge>
            <Badge
              borderRadius="full"
              colorScheme={videoEnabled ? 'green' : 'red'}
            >
              {videoEnabled ? 'Video on' : 'Video off'}
            </Badge>
          </HStack>
        </HStack>

        <HStack align="start" spacing={6}>
          <Box flex="1" minW={0}>
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              boxShadow="sm"
              overflow="hidden"
            >
              <HStack
                px={4}
                py={3}
                borderBottom="1px solid"
                borderColor="gray.200"
                justify="space-between"
              >
                <HStack spacing={3} minW={0}>
                  <Avatar.Root size="sm">
                    <Avatar.Image
                      src={image ? getImageUrl(image) : undefined}
                    />
                    <Avatar.Fallback>
                      {(username || 'U').charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <Box minW={0}>
                    <Text fontWeight="semibold" color="gray.900" noOfLines={1}>
                      {username || 'You'}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Tap a tile to focus
                    </Text>
                  </Box>
                </HStack>

                <Badge borderRadius="full" colorScheme="blue">
                  You
                </Badge>
              </HStack>

              <Box
                position="relative"
                bg="black"
                aspectRatio="16/9"
                cursor="pointer"
                onClick={() => handleVideoClick('local')}
              >
                <Box
                  position="absolute"
                  inset={0}
                  opacity={maximizedId && maximizedId !== 'local' ? 0.35 : 1}
                  transition="0.2s"
                >
                  <video
                    ref={(video) => {
                      if (!video) return

                      if (maximizedId === 'local') {
                        video.srcObject = localStreamRef.current
                        video.muted = true
                      } else {
                        video.srcObject = remoteStreams[maximizedId]
                        video.muted = false
                      }
                    }}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>

                <Box
                  position="absolute"
                  left={3}
                  bottom={3}
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  bg="blackAlpha.700"
                  color="white"
                  fontSize="sm"
                  display="inline-flex"
                  gap={2}
                  alignItems="center"
                >
                  <Box w="8px" h="8px" borderRadius="full" bg="green.400" />
                  {username || 'You'}
                </Box>
              </Box>

              <HStack
                px={4}
                py={4}
                justify="space-between"
                flexWrap="wrap"
                gap={3}
                bg="white"
              >
                <HStack spacing={2}>
                  <IconButton
                    aria-label={audioEnabled ? 'Mute' : 'Unmute'}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleAudio()
                    }}
                    borderRadius="full"
                    variant="outline"
                    size="sm"
                  >
                    {audioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                  </IconButton>

                  <IconButton
                    aria-label={videoEnabled ? 'Stop video' : 'Start video'}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleVideo()
                    }}
                    borderRadius="full"
                    variant="outline"
                    size="sm"
                  >
                    {videoEnabled ? (
                      <Video size={18} />
                    ) : (
                      <VideoOff size={18} />
                    )}
                  </IconButton>

                  <IconButton
                    aria-label={screenSharing ? 'Stop sharing' : 'Share screen'}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleScreenShare()
                    }}
                    borderRadius="full"
                    variant={screenSharing ? 'solid' : 'outline'}
                    size="sm"
                  >
                    {screenSharing ? (
                      <MonitorX size={18} />
                    ) : (
                      <ScreenShare size={18} />
                    )}
                  </IconButton>
                </HStack>

                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    disconnectCall()
                  }}
                  borderRadius="full"
                  bg="red.500"
                  color="white"
                  _hover={{ bg: 'red.600' }}
                  leftIcon={<PhoneOff size={18} />}
                >
                  Leave
                </Button>
              </HStack>
            </Box>

            <Box mt={6}>
              <HStack justify="space-between" mb={3}>
                <Text fontWeight="semibold" color="gray.700">
                  Participants
                </Text>
                <Badge borderRadius="full" colorScheme="gray">
                  {Object.keys(remoteStreams).length + 1} total
                </Badge>
              </HStack>

              <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="sm"
                  cursor="pointer"
                  onClick={() => handleVideoClick('local')}
                  opacity={maximizedId && maximizedId !== 'local' ? 0.65 : 1}
                  transition="0.2s"
                >
                  <HStack
                    px={3}
                    py={2}
                    justify="space-between"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                  >
                    <HStack spacing={2} minW={0}>
                      <Avatar.Root size="xs">
                        <Avatar.Image
                          src={image ? getImageUrl(image) : undefined}
                        />
                        <Avatar.Fallback>
                          {(username || 'U').charAt(0).toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
                        {username || 'You'}
                      </Text>
                    </HStack>
                    <Badge borderRadius="full" colorScheme="blue">
                      You
                    </Badge>
                  </HStack>
                  <Box bg="black" aspectRatio="16/9">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                </Box>

                {Object.entries(remoteStreams).map(([id, stream]) => (
                  <Box
                    key={id}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="2xl"
                    overflow="hidden"
                    boxShadow="sm"
                    cursor="pointer"
                    onClick={() => handleVideoClick(id)}
                    opacity={maximizedId && maximizedId !== id ? 0.65 : 1}
                    transition="0.2s"
                  >
                    <HStack
                      px={3}
                      py={2}
                      justify="space-between"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                    >
                      <HStack spacing={2} minW={0}>
                        <Avatar.Root size="xs">
                          <Avatar.Image
                            src={
                              usersInfo[id]?.image
                                ? getImageUrl(usersInfo[id].image)
                                : undefined
                            }
                          />
                          <Avatar.Fallback>
                            {(usersInfo[id]?.username || 'U')
                              .charAt(0)
                              .toUpperCase()}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
                          {usersInfo[id]?.username || 'User'}
                        </Text>
                      </HStack>

                      <Badge borderRadius="full" colorScheme="gray">
                        Guest
                      </Badge>
                    </HStack>

                    <Box bg="black" aspectRatio="16/9">
                      <video
                        autoPlay
                        playsInline
                        ref={(video) => {
                          if (video && stream) video.srcObject = stream
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Box>
        </HStack>
      </Box>
    </Box>
  )
}

export default Room
