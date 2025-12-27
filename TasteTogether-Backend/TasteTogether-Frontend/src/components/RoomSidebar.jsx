import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Client from '../services/api'
import {
  Box,
  Text,
  Stack,
  HStack,
  Image,
  Button,
  IconButton,
  Drawer
} from '@chakra-ui/react'
import { Radio } from 'lucide-react'

const RoomSidebar = ({ user }) => {
  if (!user) return null

  const [activeRooms, setActiveRooms] = useState([])

  useEffect(() => {
    const activeRooms = async () => {
      try {
        const response = await Client.get('/room')
        const rooms = response.data.rooms || []
        const filteredRooms = rooms.filter((room) => room.isActive)
        setActiveRooms(filteredRooms)
      } catch (error) {
        console.error('Failed to fetch rooms:', error)
      }
    }

    activeRooms()
  }, [])
  const [open, setOpen] = useState(false)

  return (
    <Box w="340px">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="semibold" color="gray.500">
          Rooms
        </Text>

        <Box
          as={Link}
          to="/rooms"
          fontSize="sm"
          fontWeight="semibold"
          color="black.300"
          _hover={{ textDecoration: 'none', opacity: 0.9 }}
        >
          See All
        </Box>
      </HStack>

      {activeRooms.length === 0 ? (
        <Text fontSize="sm" color="gray.500">
          No active rooms
        </Text>
      ) : (
        <Stack spacing={3}>
          {activeRooms.slice(0, 6).map((room) => (
            <HStack key={room._id || room.roomId} justify="space-between">
              <HStack spacing={3} minW={0}>
                <Box
                  w="44px"
                  h="44px"
                  borderRadius="full"
                  bg="gray.800"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="gray.200"
                >
                  <Radio size={18} />
                </Box>

                <Box minW={0}>
                  <Box
                    as={Link}
                    to={`/room/${room.roomId}`}
                    fontWeight="semibold"
                    color="gray.100"
                    _hover={{ textDecoration: 'none' }}
                  >
                    <Text noOfLines={1}>{room.roomName}</Text>
                  </Box>

                  <Text fontSize="sm" color="gray.500">
                    Active now
                  </Text>
                </Box>
              </HStack>

              <Button
                as={Link}
                to={`/room/${room.roomId}`}
                size="sm"
                variant="ghost"
                color="black.300"
                _hover={{ bg: 'whiteAlpha.100' }}
              >
                Join
              </Button>
            </HStack>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default RoomSidebar
