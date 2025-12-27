import { useState } from 'react'
import Client from '../services/api'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Text,
  Stack,
  HStack,
  Heading,
  Button,
  Input,
  Textarea,
  Center
} from '@chakra-ui/react'
const CreateRoom = () => {
  const navigate = useNavigate()

  const initialState = {
    roomName: '',
    description: ''
  }

  const [roomState, setRoomState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { id, value } = event.target
    setRoomState({ ...roomState, [id]: value })
    if (value.trim()) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!roomState.roomName.trim()) {
      setError('Room name is required')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await Client.post(
        '/room/create',
        {
          roomName: roomState.roomName.trim(),
          description: roomState.description.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      const newRoom = response.data
      navigate(`/room/${newRoom.roomId}`)
    } catch (error) {
      console.error(error)
      setError(error.response?.data?.msg || 'Failed to create room')
    }
    setLoading(false)
  }

  return (
    <Center minH="100vh" bg="gray.50" px={{ base: 4, md: 8 }}>
      <Box
        w="100%"
        maxW="560px"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="2xl"
        boxShadow="sm"
        p={{ base: 6, md: 8 }}
      >
        <Stack spacing={6}>
          <Box>
            <Heading size="lg" color="gray.900">
              Create a Video Call Room
            </Heading>
            <Text color="gray.600" mt={1}>
              Give your room a name and an optional description.
            </Text>
          </Box>

          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  mb={2}
                >
                  Room Name
                </Text>
                <Input
                  id="roomName"
                  value={roomState.roomName}
                  onChange={handleChange}
                  placeholder="e.g. Friends Dinner "
                  borderRadius="xl"
                  bg="gray.50"
                  borderColor="gray.200"
                  _focusVisible={{ borderColor: 'gray.900' }}
                  required
                />
              </Box>

              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    Description
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Optional
                  </Text>
                </HStack>

                <Textarea
                  id="description"
                  value={roomState.description}
                  onChange={handleChange}
                  placeholder="What is this room for?"
                  borderRadius="xl"
                  bg="gray.50"
                  borderColor="gray.200"
                  resize="vertical"
                  minH="110px"
                  _focusVisible={{ borderColor: 'gray.900' }}
                />
              </Box>

              {error && (
                <Box
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.200"
                  borderRadius="xl"
                  p={3}
                >
                  <Text color="red.700" fontSize="sm">
                    {error}
                  </Text>
                </Box>
              )}

              <Button
                type="submit"
                borderRadius="full"
                bg="gray.900"
                color="white"
                _hover={{ bg: 'gray.800' }}
                isDisabled={loading || !roomState.roomName.trim()}
              >
                {loading ? 'Creating...' : 'Create Room'}
              </Button>

              <Text fontSize="xs" color="gray.500" textAlign="center">
                You can't edit room details later.
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Center>
  )
}

export default CreateRoom
