import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Client from '../services/api'
import { BASE_URL } from '../services/api'
import UsersSearchBar from '../components/UsersSearchBar'
import {
  Avatar,
  IconButton,
  Box,
  HStack,
  Text,
  SimpleGrid,
  Center,
  Spinner
} from '@chakra-ui/react'
import { FaRandom } from 'react-icons/fa'

const UsersList = () => {
  const [loading, setLoading] = useState(true)

  const [users, setUsers] = useState([])

  useEffect(() => {
    const Users = async () => {
      try {
        setLoading(true)
        const response = await Client.get('/users')
        setUsers(response.data)
      } catch (error) {
        console.error('Error loading users', error)
      }
    }
    Users()
    setLoading(false)
  }, [])

  return (
    <Box px={{ base: 4, md: 10 }} py={8} pl={{ base: '72px', md: '96px' }}>
      <HStack justify="space-between" align="center" mb={5}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">
            Users
          </Text>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Browse profiles & discover people
          </Text>
        </Box>

        <HStack spacing={3}>
          <IconButton
            as={Link}
            to="/profile/randomProfile"
            aria-label="Random profile"
            borderRadius="full"
            bg="#beda0aff"
            color="white"
            boxShadow="sm"
            _hover={{ bg: 'gray.800', transform: 'rotate(90deg)' }}
            transition="all 0.2s ease"
            size="sm"
          >
            <FaRandom size={16} />
          </IconButton>
        </HStack>
      </HStack>

      <Box maxW="520px" mb={6}>
        <UsersSearchBar />
      </Box>
      {loading ? (
        <Center py={16}>
          <Spinner size="lg" thickness="3px" />
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 1, lg: 2 }} spacing={4} gap={3}>
          {users.map((u) => (
            <Box
              key={u._id}
              as={Link}
              to={`/profile/${u._id}`}
              bg="#e6f48ab4"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              p={4}
              boxShadow="sm"
              backdropFilter="blur(10px)"
              transition="all 0.2s ease"
              _hover={{
                transform: 'translateY(-3px)',
                boxShadow: 'lg',
                borderColor: 'gray.300'
              }}
              _active={{ transform: 'translateY(-1px)' }}
            >
              <HStack spacing={4} align="center">
                <Box
                  borderRadius="full"
                  p="2px"
                  bg="linear-gradient(135deg, rgba(49,151,149,0.35), rgba(90,103,216,0.35))"
                >
                  <Avatar.Root
                    size="md"
                    shape="full"
                    style={{ borderRadius: '50%', overflow: 'hidden' }}
                  >
                    <Avatar.Fallback
                      bg="gray.200"
                      style={{ borderRadius: '50%' }}
                    >
                      {u.username?.[0]?.toUpperCase() || 'U'}
                    </Avatar.Fallback>

                    {u.image && (
                      <Avatar.Image
                        src={`${BASE_URL}/uploads/${u.image}`}
                        style={{ borderRadius: '50%' }}
                      />
                    )}
                  </Avatar.Root>
                </Box>

                <Box flex="1" minW={0}>
                  <Text fontWeight="semibold" color="gray.900" noOfLines={1}>
                    {u.username}
                  </Text>

                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {(u.firstName || '') + ' ' + (u.lastName || '')}
                  </Text>

                  <Box
                    mt={2}
                    display="inline-flex"
                    px={2}
                    py={1}
                    borderRadius="full"
                    bg="gray.100"
                    fontSize="xs"
                    color="gray.700"
                  >
                    View profile →
                  </Box>
                </Box>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}

export default UsersList
