import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Client from '../services/api'
import {
  Box,
  Text,
  Stack,
  HStack,
  Heading,
  Button,
  Badge,
  Switch,
  Avatar
} from '@chakra-ui/react'
import { Plus, ArrowRight } from 'lucide-react'

const RoomsList = ({ user }) => {
  const [rooms, setRooms] = useState([])
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem('userId')

  useEffect(() => {
    const rooms = async () => {
      try {
        const response = await Client.get('/room')
        setRooms(response.data.rooms || [])
      } catch (error) {
        console.error('Failed to fetch rooms:', error)
      }
    }
    rooms()
  }, [])

  const toggleRoomActive = async (roomId, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await Client.put(
        `/room/${roomId}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!response.data.room) {
        throw new Error('No updated room returned from backend')
      }

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.roomId === roomId ? response.data.room : room
        )
      )
    } catch (error) {
      console.error('Failed to update room status:', error)
      alert('Failed to update room status')
    }
  }

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 8 }}
    >
      <Box maxW="900px" mx="auto">
        <HStack
          justify="space-between"
          align="center"
          mb={6}
          flexWrap="wrap"
          gap={3}
        >
          <Box>
            <Heading size="lg" color="gray.900">
              Available Rooms
            </Heading>
            <Text color="gray.600" mt={1}>
              Join a room or create a new one.
            </Text>
          </Box>

          <Button
            as={Link}
            to="/create"
            borderRadius="full"
            bg="gray.900"
            color="white"
            _hover={{ bg: 'gray.800' }}
            leftIcon={<Plus size={18} />}
          >
            Create Room
          </Button>
        </HStack>

        {rooms.length === 0 ? (
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="2xl"
            p={8}
            textAlign="center"
            boxShadow="sm"
          >
            <Heading size="md" color="gray.900">
              No rooms yet
            </Heading>
            <Text color="gray.600" mt={2} mb={5}>
              Create one and invite others to join.
            </Text>

            <Button
              as={Link}
              to="/create"
              borderRadius="full"
              variant="outline"
              leftIcon={<Plus size={18} />}
            >
              Create New Room
            </Button>
          </Box>
        ) : (
          <Stack spacing={4}>
            {rooms.map((room, index) => {
              const creator = room.createdBy
              const creatorId =
                typeof creator === 'object' ? creator?._id : creator
              const creatorUsername =
                typeof creator === 'object'
                  ? creator?.username
                  : room.createdByUsername
              const creatorImage =
                typeof creator === 'object'
                  ? creator?.image
                  : room.createdByImage

              const isCreator = creatorId?.toString() === currentUserId
              const isInactive = room.isActive === false

              return (
                <Box
                  key={room._id || room.roomId || index}
                  bg="#fcf45fb3"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="2xl"
                  p={{ base: 4, md: 5 }}
                  boxShadow="sm"
                  transition="0.2s"
                  _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                  opacity={isInactive ? 0.75 : 1}
                >
                  <HStack justify="space-between" align="start" gap={4}>
                    <Box minW={0}>
                      <HStack spacing={2} mb={1} flexWrap="wrap">
                        <Heading size="md" color="gray.900" noOfLines={1}>
                          {room.roomName}
                        </Heading>

                        <Badge
                          borderRadius="full"
                          colorScheme={isInactive ? 'gray' : 'green'}
                        >
                          {isInactive ? 'Inactive' : 'Active'}
                        </Badge>
                      </HStack>

                      {room.description && (
                        <Text color="gray.600" noOfLines={2}>
                          {room.description}
                        </Text>
                      )}

                      {(creatorUsername || creatorId) && (
                        <HStack spacing={3} mt={3}>
                          <Avatar.Root size="sm">
                            <Avatar.Image
                              src={
                                creatorImage
                                  ? `http://localhost:3001/uploads/${creatorImage}`
                                  : undefined
                              }
                            />
                            <Avatar.Fallback>
                              {(creatorUsername || 'U').charAt(0).toUpperCase()}
                            </Avatar.Fallback>
                          </Avatar.Root>

                          <Box minW={0}>
                            <Text fontSize="xs" color="gray.500">
                              Created by
                            </Text>

                            <HStack spacing={2}>
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.800"
                                noOfLines={1}
                              >
                                {creatorUsername || 'User'}
                              </Text>

                              {isCreator && (
                                <Badge borderRadius="full" colorScheme="blue">
                                  You
                                </Badge>
                              )}
                            </HStack>
                          </Box>
                        </HStack>
                      )}
                    </Box>

                    <Button
                      onClick={() => {
                        if (!isInactive) navigate(`/room/${room.roomId}`)
                      }}
                      disabled={isInactive}
                      borderRadius="full"
                      bg={isInactive ? 'gray.200' : 'gray.900'}
                      color={isInactive ? 'gray.600' : 'white'}
                      _hover={{ bg: isInactive ? 'gray.200' : 'gray.800' }}
                      rightIcon={<ArrowRight size={18} />}
                      flexShrink={0}
                    >
                      {isInactive ? 'Inactive' : 'Join'}
                    </Button>
                  </HStack>

                  {isCreator && (
                    <HStack
                      mt={4}
                      pt={4}
                      borderTop="1px solid"
                      borderColor="gray.200"
                      justify="space-between"
                      flexWrap="wrap"
                      gap={2}
                    >
                      <Text fontSize="sm" color="gray.600">
                        Room status
                      </Text>

                      <Switch.Root
                        checked={!isInactive}
                        onCheckedChange={() =>
                          toggleRoomActive(room.roomId, !isInactive)
                        }
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    </HStack>
                  )}
                </Box>
              )
            })}
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default RoomsList
